import { NextResponse } from "next/server";
import {
  getCategoryStats,
  getPopularCategories,
} from "@/utils/categoryHelpers";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const files = await fs.readdir(postsDirectory);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const fullPath = path.join(postsDirectory, file);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data } = matter(fileContents);
        return {
          meta: {
            ...data,
            categories: data.categories || [],
          },
        };
      })
  );
  return posts;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const popular = searchParams.get("popular") === "true";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    const posts = await getPosts();

    if (popular) {
      const popularCategories = await getPopularCategories(posts, limit);
      return NextResponse.json({ categoryStats: popularCategories });
    }

    const categoryStats = await getCategoryStats(posts);
    return NextResponse.json({ categoryStats });
  } catch (error) {
    console.error("Error in categories API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
