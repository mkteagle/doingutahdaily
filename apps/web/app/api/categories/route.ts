import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { CATEGORIES } from "@/constants/categories";
import type { Category } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content/blog");

export async function GET() {
  try {
    const files = await fs.readdir(postsDirectory);
    const slugs = files.filter((file) => file.endsWith(".mdx"));

    const categoryStats: Record<Category, number> = {} as Record<Category, number>;

    // Initialize counts for all categories
    CATEGORIES.forEach((cat) => {
      categoryStats[cat.name] = 0;
    });

    // Count posts per category
    for (const slug of slugs) {
      const fullPath = path.join(postsDirectory, slug);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data } = matter(fileContents);

      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach((cat: Category) => {
          if (cat in categoryStats) {
            categoryStats[cat]++;
          }
        });
      }
    }

    const result = Object.entries(categoryStats).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({ categoryStats: result });
  } catch (error) {
    console.error("Error loading category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}
