import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "@/utils/blogHelpers";
import {
  validateFrontmatter,
  getDefaultedFrontmatter,
} from "@/utils/MDXMetadataHelpers";
import type { Blog } from "@/types/blog";
import { serialize } from "next-mdx-remote/serialize";

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog");
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const validatedData = validateFrontmatter(data);
    const defaultedData = getDefaultedFrontmatter(validatedData);

    const meta = {
      ...defaultedData,
      slug,
      readingTime: calculateReadingTime(content),
    };

    const serializedContent = await serialize(content, {
      parseFrontmatter: true,
    });

    return {
      meta,
      content: serializedContent,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog");
    const filenames = await fs.readdir(postsDirectory);
    return filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) => filename.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error getting blog slugs:", error);
    return [];
  }
}
