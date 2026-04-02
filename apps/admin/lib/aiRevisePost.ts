import { POST_CATEGORIES } from "@/lib/postCategories";

export interface RevisePostRequest {
  instruction: string;
  title: string;
  excerpt: string;
  content: string;
  categories?: string[];
}

export interface RevisedPostDraft {
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
}

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const reviseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "excerpt", "content", "categories"],
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    content: { type: "string" },
    categories: {
      type: "array",
      items: {
        type: "string",
        enum: [...POST_CATEGORIES],
      },
    },
  },
} as const;

function extractTextResponse(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const output = payload?.output;
  if (!Array.isArray(output)) return null;

  for (const item of output) {
    if (!Array.isArray(item?.content)) continue;
    for (const contentItem of item.content) {
      if (typeof contentItem?.text === "string" && contentItem.text.trim()) {
        return contentItem.text;
      }
    }
  }

  return null;
}

function sanitizeCategories(categories: string[], current: string[] = []) {
  const allowed = new Set(POST_CATEGORIES);
  const merged = [...categories, ...current].filter((category) =>
    allowed.has(category as (typeof POST_CATEGORIES)[number])
  );

  return [...new Set(merged)].slice(0, 4);
}

export async function revisePostDraft({
  instruction,
  title,
  excerpt,
  content,
  categories,
}: RevisePostRequest): Promise<RevisedPostDraft> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const systemPrompt = [
    "You are revising a blog post draft for Doing Utah Daily, a warm and practical Utah family activities publication.",
    "Return valid JSON only.",
    "Keep the voice trustworthy, local, and useful for busy parents.",
    "Preserve valid MDX formatting.",
    "Do not invent concrete facts that are not already in the draft or instruction.",
    `Only use these categories: ${POST_CATEGORIES.join(", ")}.`,
  ].join(" ");

  const userPrompt = [
    `Revision instruction:\n${instruction.trim()}`,
    `Current title:\n${title.trim() || "Untitled draft"}`,
    `Current excerpt:\n${excerpt.trim() || "None provided."}`,
    `Current categories:\n${categories?.join(", ") || "None selected."}`,
    `Current content:\n${content.trim() || "This draft is still mostly blank."}`,
    [
      "Revision rules:",
      "- Apply the instruction directly.",
      "- Keep the post practical and readable.",
      "- Improve the title and excerpt when the instruction suggests it.",
      "- Keep the result concise unless the instruction asks for expansion.",
      "- If a fact is uncertain, preserve the uncertainty instead of guessing.",
    ].join("\n"),
  ].join("\n\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "doing_utah_daily_post_revision",
          schema: reviseSchema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${message}`);
  }

  const payload = await response.json();
  const text = extractTextResponse(payload);
  if (!text) {
    throw new Error("The AI response did not include usable text.");
  }

  const parsed = JSON.parse(text) as RevisedPostDraft;

  return {
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim(),
    content: parsed.content.trim(),
    categories: sanitizeCategories(parsed.categories || [], categories),
  };
}
