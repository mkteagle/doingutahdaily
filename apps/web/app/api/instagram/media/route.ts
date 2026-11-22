import { socialService } from "@dud/db";

export async function GET() {
  const filter = { platform: "instagram" } as const;

  try {
    const [posts, mediaCount] = await Promise.all([
      socialService.getSocialPosts(filter),
      socialService.countSocialPosts(filter),
    ]);
    return Response.json({
      media: posts.map((post) => ({
        id: post.id,
        caption: post.caption,
        media_type: post.mediaType === "CAROUSEL" ? "CAROUSEL_ALBUM" : post.mediaType,
        media_url: post.mediaUrl,
        thumbnail_url: post.thumbnailUrl,
        permalink: post.permalink,
        timestamp: post.timestamp.toISOString(),
      })),
      profile: { username: "doingutahdaily", media_count: mediaCount, profile_picture_url: null },
    });
  } catch {
    console.error("Could not load the cached Instagram feed.");
    return Response.json({ error: "Failed to fetch Instagram media" }, { status: 500 });
  }
}
