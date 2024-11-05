import { getAllPosts } from "@/lib/blog";
import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  type CategoryStats,
} from "@/constants/categories";
import type { Metadata } from "next";
import { H1, H3, Paragraph } from "@/components/ui/typography";
import { CategoriesWidget } from "@/components/Blog/CategoryWidget";

export const metadata: Metadata = {
  title: "Categories | Doing Utah Daily",
  description:
    "Explore our content by category and discover family-friendly activities and events across Utah.",
};

export default async function CategoriesPage() {
  const posts = await getAllPosts();

  // Initialize counts for all categories
  const categoryCounts: Record<string, number> = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0])
  );

  // Count posts per category
  posts.forEach((post) => {
    post.meta.categories.forEach((category) => {
      if (category in categoryCounts) {
        categoryCounts[category]++;
      }
    });
  });

  // Format data for the widget, including categories with 0 posts
  const categoryStats: CategoryStats[] = CATEGORIES.map((category) => ({
    category,
    count: categoryCounts[category],
    description: CATEGORY_DESCRIPTIONS[category],
  }));

  return (
    <div className="container mx-auto px-4 py-16">
      <H3 className="mb-4">Categories</H3>
      <Paragraph className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Explore our content by category to find the perfect activities and
        events for your family. Each category represents a unique way to
        experience Utah with your loved ones.
      </Paragraph>

      <CategoriesWidget categories={categoryStats} variant="fullpage" />
    </div>
  );
}
