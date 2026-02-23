import { NextResponse } from "next/server";
import { InstagramGraphService } from "@/lib/instagramGraph";

export async function GET() {
  try {
    const [media, profile] = await Promise.all([
      InstagramGraphService.getMedia(12),
      InstagramGraphService.getProfile(),
    ]);

    return NextResponse.json({
      media,
      profile,
    });
  } catch (error) {
    console.error("Instagram Graph API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram media" },
      { status: 500 }
    );
  }
}
