import { NextResponse } from "next/server";
import { postService } from "@dud/db";
import { generateDraftPost } from "@/lib/aiDraftPost";
import { createUniquePostSlug } from "@/lib/postDrafts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt, supportingNotes, categories } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "A draft prompt is required." },
        { status: 400 }
      );
    }

    const draft = await generateDraftPost({
      prompt,
      supportingNotes,
      categories: Array.isArray(categories) ? categories : [],
    });

    const post = await postService.createPost({
      slug: await createUniquePostSlug(draft.title),
      title: draft.title,
      content: draft.content,
      excerpt: draft.excerpt,
      published: false,
      categories: draft.categories,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error generating AI draft:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate draft",
      },
      { status: 500 }
    );
  }
}
