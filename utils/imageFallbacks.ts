import { CATEGORY_FALLBACKS, DEFAULT_FALLBACKS } from "@/constants/categories";

export function getFallbackImage(category: string): string[] {
  const fallbacks = CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACKS;
  return fallbacks.map(
    (url) => `${url}?auto=format&w=2000&h=1000&fit=crop&q=85`
  );
}
