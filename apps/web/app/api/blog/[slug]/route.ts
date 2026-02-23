import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { postService } from "@dud/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await postService.getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      post: {
        meta: {
          slug: post.slug,
          title: post.title,
          date: post.publishedAt?.toISOString() ?? new Date().toISOString(),
          excerpt: post.excerpt,
          author: { name: post.author },
          coverImage: post.coverImage,
          categories: post.categories.map((c) => c.name),
          readingTime: calculateReadingTime(post.content),
        },
        content: await serialize(post.content, { parseFrontmatter: true }),
      },
    });
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
