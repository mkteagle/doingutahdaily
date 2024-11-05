import { NextResponse } from "next/server";
import { getCategoryPosts } from "@/utils/categoryHelpers";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const files = await fs.readdir(postsDirectory);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const fullPath = path.join(postsDirectory, file);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        const serializedContent = await serialize(content, {
          parseFrontmatter: true,
        });

        return {
          meta: {
            ...data,
            slug: file.replace(/\.mdx$/, ""),
            readingTime: calculateReadingTime(content),
            categories: data.categories || [],
          },
          content: serializedContent,
        };
      })
  );
  return posts;
}

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const posts = await getPosts();
    const categoryPosts = await getCategoryPosts(params.category, posts);

    return NextResponse.json({ posts: categoryPosts });
  } catch (error) {
    console.error("Error in category posts API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch category posts" },
      { status: 500 }
    );
  }
}
