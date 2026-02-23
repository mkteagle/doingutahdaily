import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import {
  validateFrontmatter,
  getDefaultedFrontmatter,
} from "@/utils/MDXMetadataHelpers";
import type { Blog } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content/blog");

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;
    const files = await fs.readdir(postsDirectory);
    const slugs = files.filter((file) => file.endsWith(".mdx"));

    const posts: Blog[] = [];

    for (const slug of slugs) {
      const fullPath = path.join(postsDirectory, slug);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const validatedData = validateFrontmatter(data);
      const defaultedData = getDefaultedFrontmatter(validatedData);

      // Check if this post has the requested category
      if (
        defaultedData.categories &&
        Array.isArray(defaultedData.categories) &&
        defaultedData.categories.some((cat) => cat === category)
      ) {
        const meta = {
          ...defaultedData,
          slug: slug.replace(/\.mdx$/, ""),
          readingTime: calculateReadingTime(content),
        };

        const serializedContent = await serialize(content, {
          parseFrontmatter: true,
        });

        posts.push({
          meta,
          content: serializedContent,
        });
      }
    }

    // Sort posts by date
    const sortedPosts = posts.sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );

    return NextResponse.json({ posts: sortedPosts });
  } catch (error) {
    console.error("Error loading category posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch category posts" },
      { status: 500 }
    );
  }
}
