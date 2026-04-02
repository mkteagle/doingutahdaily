import { POST_CATEGORIES } from "./postCategories";
import { callOpenAi, sanitizeCategories } from "./openai";

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

export async function revisePostDraft({
  instruction,
  title,
  excerpt,
  content,
  categories,
}: RevisePostRequest): Promise<RevisedPostDraft> {
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

  const text = await callOpenAi(
    [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: userPrompt }],
      },
    ],
    "doing_utah_daily_post_revision",
    reviseSchema
  );

  const parsed = JSON.parse(text) as RevisedPostDraft;

  return {
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim(),
    content: parsed.content.trim(),
    categories: sanitizeCategories(parsed.categories || [], categories),
  };
}
