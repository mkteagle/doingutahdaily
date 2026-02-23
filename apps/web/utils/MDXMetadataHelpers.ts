// utils/MDXMetadataHelpers.ts
import { z } from "zod";
import type { Category } from "@/types/blog";

// Category validation schema
export const categorySchema = z.enum([
  // Base Categories
  "Family Activities",
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Free Events",
  "Holiday Events",
  "Food & Dining",
  "Arts & Culture",

  // Seasonal Categories
  "Spring",
  "Summer",
  "Fall",
  "Winter",

  // Holiday Categories
  "Easter",
  "Christmas",
  "Thanksgiving",
  "Valentine's Day",
  "Fourth of July",
] as const);

// Rest of your existing code remains the same
export const frontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  coverImage: z.string().optional(),
  date: z.string(),
  author: z.object({
    name: z.string(),
    picture: z.string().optional(),
  }),
  ogImage: z
    .object({
      url: z.string(),
    })
    .nullable()
    .optional(),
  categories: z.array(categorySchema).min(1),
});

export type MDXFrontmatter = z.infer<typeof frontmatterSchema>;

export function validateFrontmatter(frontmatter: any): MDXFrontmatter {
  try {
    return frontmatterSchema.parse(frontmatter);
  } catch (error) {
    console.error("Frontmatter validation error:", error);
    console.error("Received frontmatter:", frontmatter);
    throw error;
  }
}

// Helper to get a typed category array from raw data
export function validateCategories(categories: unknown): Category[] {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories.filter(
    (category): category is Category =>
      categorySchema.safeParse(category).success
  );
}

export function getDefaultedFrontmatter(frontmatter: MDXFrontmatter) {
  return {
    ...frontmatter,
    coverImage: frontmatter.coverImage ?? "/images/placeholder.jpg",
    ogImage: frontmatter.ogImage ?? { url: "/images/placeholder.jpg" },
    author: {
      name: frontmatter.author.name,
      picture: frontmatter.author.picture ?? "/images/default-avatar.jpg",
    },
  };
}
