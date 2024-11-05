// utils/blogHelpers.ts
import { CATEGORY_COLORS } from "@/constants/categories";
import { Category } from "@/types/blog";

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export const CATEGORIES: Category[] = [
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
  "Easter",
  "Christmas",
  "Thanksgiving",
  "Valentine's Day",
  "Fourth of July",
];

export function normalizeCategories(
  categories: string | string[] | undefined
): Category[] {
  if (!categories) return [];
  const normalizedCategories = Array.isArray(categories)
    ? categories
    : [categories];
  // Filter to ensure only valid categories are included
  return normalizedCategories.filter((category): category is Category =>
    CATEGORIES.includes(category as Category)
  );
}

export function getCategoryColor(category: Category) {
  const colors = CATEGORY_COLORS[category];
  return {
    bg: colors.light.split(" ")[0],
    text: colors.light.split(" ")[1],
    border: colors.light.split(" ")[2],
  };
}
