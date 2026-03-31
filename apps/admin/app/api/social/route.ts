import { NextResponse } from "next/server";
import { socialService } from "@dud/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const rawPlatform = searchParams.get("platform");
    const platform = rawPlatform === "instagram" || rawPlatform === "tiktok" ? rawPlatform : undefined;
    const posts = await socialService.getSocialPosts({ platform, limit });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching social posts:", error);
    return NextResponse.json({ error: "Failed to fetch social posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { platform, caption, mediaUrl, thumbnailUrl, permalink, mediaType } = await req.json();
    const post = await socialService.createSocialPost({
      platform,
      caption,
      mediaUrl,
      thumbnailUrl,
      permalink,
      mediaType,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json({ error: "Failed to create social post" }, { status: 500 });
  }
}
