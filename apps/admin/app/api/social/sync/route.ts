import { NextResponse } from "next/server";
import { socialService } from "@dud/db";

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

async function fetchInstagramMedia(): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_GRAPH_TOKEN;
  if (!token) {
    console.warn("INSTAGRAM_GRAPH_TOKEN not set");
    return [];
  }
  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Instagram media:", error);
    return [];
  }
}

export async function POST() {
  try {
    const instagramMedia = await fetchInstagramMedia();

    for (const media of instagramMedia) {
      await socialService.upsertInstagramPost({
        id: media.id,
        caption: media.caption,
        mediaUrl: media.media_url,
        thumbnailUrl: media.thumbnail_url,
        mediaType: media.media_type,
        permalink: media.permalink,
        timestamp: media.timestamp,
      });
    }

    return NextResponse.json({ success: true, synced: instagramMedia.length });
  } catch (error) {
    console.error("Social sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
