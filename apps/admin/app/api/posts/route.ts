import { NextResponse } from "next/server";
import { postService } from "@dud/db";
import { createUniquePostSlug } from "@/lib/postDrafts";

export async function GET() {
  try {
    const posts = await postService.getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      categories,
      published,
      scheduledAt,
    } = await req.json();
    const normalizedTitle =
      typeof title === "string" && title.trim() ? title.trim() : "Untitled draft";

    const post = await postService.createPost({
      slug: await createUniquePostSlug(normalizedTitle),
      title: normalizedTitle,
      content: content || "",
      excerpt: excerpt || "",
      coverImage,
      published: published ?? false,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      categories: categories ?? [],
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
