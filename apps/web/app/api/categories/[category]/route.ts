import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { prisma } from "@dud/db";

export async function GET(
  _request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        categories: {
          some: {
            name: category,
          },
        },
      },
      include: { categories: true },
      orderBy: { publishedAt: "desc" },
    });

    const serializedPosts = await Promise.all(
      posts.map(async (post) => {
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

        return {
          meta,
          content,
        };
      })
    );

    return NextResponse.json({ posts: serializedPosts });
  } catch (error) {
    console.error("Error loading category posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch category posts" },
      { status: 500 }
    );
  }
}
