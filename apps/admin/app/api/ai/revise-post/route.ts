import { NextResponse } from "next/server";
import { revisePostDraft } from "@/lib/aiRevisePost";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { instruction, title, excerpt, content, categories } = await req.json();

    if (
      !instruction ||
      typeof instruction !== "string" ||
      !instruction.trim()
    ) {
      return NextResponse.json(
        { error: "A revision instruction is required." },
        { status: 400 }
      );
    }

    const draft = await revisePostDraft({
      instruction,
      title: typeof title === "string" ? title : "",
      excerpt: typeof excerpt === "string" ? excerpt : "",
      content: typeof content === "string" ? content : "",
      categories: Array.isArray(categories) ? categories : [],
    });

    return NextResponse.json({ draft }, { status: 200 });
  } catch (error) {
    console.error("Error revising AI draft:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to revise draft",
      },
      { status: 500 }
    );
  }
}
