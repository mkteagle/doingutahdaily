import { prisma } from "../client";

export async function getSocialPosts(options?: {
  platform?: string;
  limit?: number;
}) {
  return prisma.socialPost.findMany({
    where: options?.platform ? { platform: options.platform } : undefined,
    orderBy: { timestamp: "desc" },
    take: options?.limit ?? 12,
  });
}

export async function upsertInstagramPost(data: {
  id: string;
  caption?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: string;
  permalink: string;
  timestamp: string;
}) {
  return prisma.socialPost.upsert({
    where: { id: data.id },
    update: {
      caption: data.caption ?? null,
      mediaUrl: data.mediaUrl,
      thumbnailUrl: data.thumbnailUrl ?? null,
      cachedAt: new Date(),
    },
    create: {
      id: data.id,
      platform: "instagram",
      caption: data.caption ?? null,
      mediaUrl: data.mediaUrl,
      thumbnailUrl: data.thumbnailUrl ?? null,
      mediaType: data.mediaType,
      permalink: data.permalink,
      timestamp: new Date(data.timestamp),
    },
  });
}

export async function createSocialPost(data: {
  platform: string;
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink: string;
  mediaType?: string;
}) {
  return prisma.socialPost.create({
    data: {
      id: `${data.platform}-${Date.now()}`,
      platform: data.platform,
      caption: data.caption ?? null,
      mediaUrl: data.mediaUrl ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
      mediaType: data.mediaType ?? "IMAGE",
      permalink: data.permalink,
      timestamp: new Date(),
    },
  });
}

export async function deleteSocialPost(id: string) {
  return prisma.socialPost.delete({ where: { id } });
}
