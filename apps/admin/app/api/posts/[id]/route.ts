import { NextResponse } from "next/server";
import { postService } from "@dud/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await postService.getPostById(params.id);
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
    const { title, content, excerpt, coverImage, categories, published } = await req.json();
    const post = await postService.updatePost(params.id, {
      title,
      content,
      excerpt,
      coverImage,
      published,
      categories,
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
    await postService.deletePost(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
