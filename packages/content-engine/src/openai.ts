export const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export function getOpenAiModel() {
  return process.env.OPENAI_MODEL || "gpt-5-mini";
}

export function extractTextResponse(payload: any) {
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

export function sanitizeCategories(categories: string[], fallback: string[] = []) {
  const allowed = new Set<string>([
    "Family Activities",
    "Outdoor Adventures",
    "Indoor Activities",
    "Seasonal Events",
    "Free Events",
    "Holiday Events",
    "Food & Dining",
    "Arts & Culture",
    "Spring",
    "Summer",
    "Fall",
    "Winter",
  ]);

  const merged = [...categories, ...fallback].filter((category) =>
    allowed.has(category)
  );

  return [...new Set(merged)].slice(0, 4);
}

export async function callOpenAi(input: unknown, schemaName: string, schema: object) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          schema,
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

  return text;
}
