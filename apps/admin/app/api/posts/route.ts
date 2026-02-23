import { NextResponse } from "next/server";
import { prisma } from "@dud/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { categories: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, excerpt, coverImage, categories, published } = body;

    const slug = slugify(title);

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        content: content || "",
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        categories: {
          create: (categories || []).map((name: string) => ({ name })),
        },
      },
      include: { categories: true },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
