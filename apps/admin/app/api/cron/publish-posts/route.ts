import { NextResponse } from "next/server";
import { postService } from "@dud/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const published = await postService.publishScheduledPosts();
    return NextResponse.json({
      ok: true,
      publishedCount: published.length,
      postIds: published.map((post) => post.id),
    });
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
