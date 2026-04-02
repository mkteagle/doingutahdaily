import { POST_CATEGORIES } from "./postCategories";
import { callOpenAi, sanitizeCategories } from "./openai";

export interface DraftPostRequest {
  prompt: string;
  supportingNotes?: string;
  categories?: string[];
}

export interface GeneratedDraftPost {
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
}

const draftSchema = {
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

export async function generateDraftPost({
  prompt,
  supportingNotes,
  categories,
}: DraftPostRequest): Promise<GeneratedDraftPost> {
  const systemPrompt = [
    "You write blog drafts for Doing Utah Daily, a warm and practical Utah family activities publication.",
    "Return valid JSON only.",
    "Write in approachable, trustworthy language for busy parents.",
    "Prefer clear structure, short paragraphs, and skimmable headings.",
    "Output MDX content suitable for a blog editor.",
    "Do not invent concrete facts like hours, prices, addresses, or availability when they were not provided.",
    "When factual details are missing, use neutral wording and add a short 'Before you go' section listing what should be verified before publishing.",
    `Only use these categories: ${POST_CATEGORIES.join(", ")}.`,
  ].join(" ");

  const userPrompt = [
    `Draft request:\n${prompt.trim()}`,
    supportingNotes?.trim()
      ? `Supporting notes or source material:\n${supportingNotes.trim()}`
      : "Supporting notes or source material:\nNone provided.",
    categories?.length
      ? `Preferred categories:\n${categories.join(", ")}`
      : "Preferred categories:\nChoose the best fit from the allowed category list.",
    [
      "Draft requirements:",
      "- Create a compelling title.",
      "- Write an excerpt of 1 to 2 sentences.",
      "- Write a useful blog draft with an introduction, helpful subheads, and a short wrap-up.",
      "- Keep the voice warm, local, and practical.",
      "- If facts are uncertain, explicitly mark them for verification instead of guessing.",
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
    "doing_utah_daily_post_draft",
    draftSchema
  );

  const parsed = JSON.parse(text) as GeneratedDraftPost;

  return {
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim(),
    content: parsed.content.trim(),
    categories: sanitizeCategories(parsed.categories || [], categories),
  };
}
