import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { postService } from "@dud/db";

export async function GET() {
  try {
    const posts = await postService.getPublishedPosts();

    const serializedPosts = await Promise.all(
      posts.map(async (post: any) => ({
        meta: {
          slug: post.slug,
          title: post.title,
          date: post.publishedAt?.toISOString() ?? new Date().toISOString(),
          excerpt: post.excerpt,
          author: { name: post.author },
          coverImage: post.coverImage,
          categories: post.categories.map((c: any) => c.name),
          readingTime: calculateReadingTime(post.content),
        },
        content: await serialize(post.content, { parseFrontmatter: true }),
      }))
    );

    return NextResponse.json({ posts: serializedPosts });
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
