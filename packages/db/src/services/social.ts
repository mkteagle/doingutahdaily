import { and, count, eq, desc, sql } from "drizzle-orm";
import { db } from "../client";
import { socialPosts } from "../schema";

type SocialFilters = {
  platform?: "instagram" | "tiktok";
  mediaType?: "IMAGE" | "VIDEO" | "CAROUSEL";
};

export type InstagramPost = {
  id: string;
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL";
  permalink: string;
  timestamp: string;
};

function socialFilter(options?: SocialFilters) {
  return and(
    options?.platform ? eq(socialPosts.platform, options.platform) : undefined,
    options?.mediaType ? eq(socialPosts.mediaType, options.mediaType) : undefined,
  );
}

export async function getSocialPosts(options?: SocialFilters & {
  limit?: number;
  offset?: number;
}) {
  return db.query.socialPosts.findMany({
    where: socialFilter(options),
    orderBy: [desc(socialPosts.timestamp), desc(socialPosts.id)],
    limit: options?.limit ?? 12,
    offset: options?.offset,
  });
}

export async function countSocialPosts(options?: SocialFilters) {
  const [result] = await db.select({ total: count() }).from(socialPosts).where(socialFilter(options));
  return result.total;
}

export async function upsertInstagramPosts(posts: InstagramPost[]) {
  if (!posts.length) return;

  const cachedAt = new Date();
  await db.transaction(async (transaction) => {
    for (let start = 0; start < posts.length; start += 100) {
      await transaction.insert(socialPosts).values(posts.slice(start, start + 100).map((post) => ({
        id: post.id,
        platform: "instagram" as const,
        mediaType: post.mediaType,
        permalink: post.permalink,
        timestamp: new Date(post.timestamp),
        mediaUrl: post.mediaUrl ?? null,
        thumbnailUrl: post.thumbnailUrl ?? null,
        caption: post.caption ?? null,
        cachedAt,
      }))).onConflictDoUpdate({
        target: socialPosts.id,
        set: {
          mediaType: sql`excluded.${sql.identifier(socialPosts.mediaType.name)}`,
          permalink: sql`excluded.${sql.identifier(socialPosts.permalink.name)}`,
          timestamp: sql`excluded.${sql.identifier(socialPosts.timestamp.name)}`,
          mediaUrl: sql`excluded.${sql.identifier(socialPosts.mediaUrl.name)}`,
          thumbnailUrl: sql`excluded.${sql.identifier(socialPosts.thumbnailUrl.name)}`,
          caption: sql`excluded.${sql.identifier(socialPosts.caption.name)}`,
          cachedAt,
          updatedAt: cachedAt,
        },
        setWhere: eq(socialPosts.platform, "instagram"),
      });
    }
  });
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
