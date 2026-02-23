import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { prisma } from "@dud/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { categories: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const meta = {
      slug: post.slug,
      title: post.title,
      date: post.publishedAt?.toISOString() || new Date().toISOString(),
      excerpt: post.excerpt,
      author: { name: post.author, picture: undefined },
      coverImage: post.coverImage,
      categories: post.categories.map((c) => c.name),
      readingTime: calculateReadingTime(post.content),
    };

    const content = await serialize(post.content, {
      parseFrontmatter: true,
    });

    return NextResponse.json({
      post: {
        meta,
        content,
      },
    });
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
