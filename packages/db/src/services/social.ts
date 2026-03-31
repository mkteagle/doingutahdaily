import { eq, desc } from "drizzle-orm";
import { db } from "../client";
import { socialPosts } from "../schema";

export async function getSocialPosts(options?: {
  platform?: "instagram" | "tiktok";
  limit?: number;
}) {
  return db.query.socialPosts.findMany({
    where: options?.platform
      ? eq(socialPosts.platform, options.platform)
      : undefined,
    orderBy: desc(socialPosts.timestamp),
    limit: options?.limit ?? 12,
  });
}

export async function upsertInstagramPost(data: {
  id: string;
  caption?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL";
  permalink: string;
  timestamp: string;
}) {
  const existing = await db.query.socialPosts.findFirst({
    where: eq(socialPosts.id, data.id),
  });

  if (existing) {
    const [updated] = await db
      .update(socialPosts)
      .set({
        caption: data.caption ?? null,
        mediaUrl: data.mediaUrl,
        thumbnailUrl: data.thumbnailUrl ?? null,
        cachedAt: new Date(),
      })
      .where(eq(socialPosts.id, data.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(socialPosts)
    .values({
      id: data.id,
      platform: "instagram",
      caption: data.caption ?? null,
      mediaUrl: data.mediaUrl,
      thumbnailUrl: data.thumbnailUrl ?? null,
      mediaType: data.mediaType,
      permalink: data.permalink,
      timestamp: new Date(data.timestamp),
    })
    .returning();
  return created;
}

export async function createSocialPost(data: {
  platform: "instagram" | "tiktok";
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink: string;
  mediaType?: "IMAGE" | "VIDEO" | "CAROUSEL";
}) {
  const [post] = await db
    .insert(socialPosts)
    .values({
      id: `${data.platform}-${Date.now()}`,
      platform: data.platform,
      caption: data.caption ?? null,
      mediaUrl: data.mediaUrl ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
      mediaType: data.mediaType ?? "IMAGE",
      permalink: data.permalink,
      timestamp: new Date(),
    })
    .returning();
  return post;
}

export async function deleteSocialPost(id: string) {
  return db.delete(socialPosts).where(eq(socialPosts.id, id));
}
