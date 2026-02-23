import { NextResponse } from "next/server";
import { postService } from "@dud/db";
import { slugify } from "@/lib/utils";

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
    const { title, content, excerpt, coverImage, categories, published } = await req.json();
    const post = await postService.createPost({
      slug: slugify(title),
      title,
      content: content || "",
      excerpt: excerpt || "",
      coverImage,
      published: published ?? false,
      categories: categories ?? [],
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
