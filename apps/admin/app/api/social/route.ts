import { NextResponse } from "next/server";
import { prisma } from "@dud/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const platform = searchParams.get("platform");

    const where = platform ? { platform } : {};

    const posts = await prisma.socialPost.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching social posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, caption, mediaUrl, thumbnailUrl, permalink, mediaType } = body;

    const post = await prisma.socialPost.create({
      data: {
        id: `${platform}-${Date.now()}`,
        platform,
        caption: caption || null,
        mediaUrl,
        thumbnailUrl: thumbnailUrl || null,
        permalink,
        mediaType: mediaType || "IMAGE",
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json(
      { error: "Failed to create social post" },
      { status: 500 }
    );
  }
}
