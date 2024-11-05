import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import {
  validateFrontmatter,
  getDefaultedFrontmatter,
} from "@/utils/MDXMetadataHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
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

    return NextResponse.json({
      post: {
        meta,
        content: serializedContent,
      },
    });
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
