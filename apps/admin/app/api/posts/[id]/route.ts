import { NextResponse } from "next/server";
import { prisma } from "@dud/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { categories: true },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, content, excerpt, coverImage, categories, published } = body;

    // Delete old categories and recreate
    await prisma.postCategory.deleteMany({ where: { postId: params.id } });

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt,
        coverImage: coverImage || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        categories: {
          create: (categories || []).map((name: string) => ({ name })),
        },
      },
      include: { categories: true },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
