import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../client";
import {
  activities,
  activityAgeBands,
  activityCategories,
  activityTags,
  activitySeasons,
  verifications,
  communityConfirmations,
} from "../schema";
import type { ageBandEnum, costTierEnum, trustBadgeEnum } from "../schema";

type AgeBand = (typeof ageBandEnum.enumValues)[number];
type CostTier = (typeof costTierEnum.enumValues)[number];
type TrustBadge = (typeof trustBadgeEnum.enumValues)[number];

export async function getPublishedActivities(options?: {
  city?: string;
  region?: string;
  category?: string;
  ageBand?: AgeBand;
  costTier?: CostTier;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(activities.published, true)];

  if (options?.city) conditions.push(eq(activities.city, options.city));
  if (options?.region) conditions.push(eq(activities.region, options.region));
  if (options?.costTier)
    conditions.push(eq(activities.costTier, options.costTier));

  let query = db.query.activities.findMany({
    where: and(...conditions),
    with: {
      ageBands: true,
      categories: true,
      tags: true,
      seasons: true,
      verifications: true,
    },
    orderBy: desc(activities.updatedAt),
    limit: options?.limit ?? 50,
    offset: options?.offset,
  });

  return query;
}

export async function getActivityBySlug(slug: string) {
  return db.query.activities.findFirst({
    where: eq(activities.slug, slug),
    with: {
      ageBands: true,
      categories: true,
      tags: true,
      seasons: true,
      verifications: true,
      confirmations: {
        orderBy: desc(communityConfirmations.confirmedAt),
        limit: 10,
      },
    },
  });
}

export async function getFeaturedActivities(limit = 6) {
  return db.query.activities.findMany({
    where: and(eq(activities.published, true), eq(activities.featured, true)),
    with: {
      ageBands: true,
      categories: true,
      verifications: true,
    },
    orderBy: desc(activities.updatedAt),
    limit,
  });
}

export async function getFreeActivities(options?: {
  city?: string;
  limit?: number;
}) {
  const conditions = [
    eq(activities.published, true),
    eq(activities.costTier, "free"),
  ];
  if (options?.city) conditions.push(eq(activities.city, options.city));

  return db.query.activities.findMany({
    where: and(...conditions),
    with: { ageBands: true, categories: true, verifications: true },
    orderBy: desc(activities.updatedAt),
    limit: options?.limit ?? 50,
  });
}

export async function createActivity(data: {
  slug: string;
  title: string;
  description?: string;
  shortDescription?: string;
  address?: string;
  city?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  costTier?: CostTier;
  priceNotes?: string;
  duration?: string;
  bestTime?: string;
  parking?: string;
  restrooms?: boolean;
  strollerFriendly?: boolean;
  wheelchairAccessible?: boolean;
  website?: string;
  phone?: string;
  email?: string;
  coverImage?: string;
  images?: string[];
  published?: boolean;
  featured?: boolean;
  sourceUrl?: string;
  submittedBy?: string;
  ageBands?: AgeBand[];
  categories?: string[];
  tags?: string[];
  seasons?: string[];
}) {
  const {
    ageBands: bands,
    categories: cats,
    tags: tagList,
    seasons: seasonList,
    ...rest
  } = data;

  const [activity] = await db.insert(activities).values(rest).returning();

  const insertions = [];

  if (bands?.length) {
    insertions.push(
      db
        .insert(activityAgeBands)
        .values(bands.map((ageBand) => ({ activityId: activity.id, ageBand })))
    );
  }
  if (cats?.length) {
    insertions.push(
      db
        .insert(activityCategories)
        .values(
          cats.map((category) => ({ activityId: activity.id, category }))
        )
    );
  }
  if (tagList?.length) {
    insertions.push(
      db
        .insert(activityTags)
        .values(tagList.map((tag) => ({ activityId: activity.id, tag })))
    );
  }
  if (seasonList?.length) {
    insertions.push(
      db
        .insert(activitySeasons)
        .values(
          seasonList.map((season) => ({ activityId: activity.id, season }))
        )
    );
  }

  await Promise.all(insertions);

  return getActivityBySlug(activity.slug);
}

export async function addVerification(data: {
  activityId: string;
  badge: TrustBadge;
  verifiedBy: string;
  notes?: string;
  expiresAt?: Date;
}) {
  const [verification] = await db
    .insert(verifications)
    .values(data)
    .returning();
  return verification;
}

export async function addCommunityConfirmation(data: {
  activityId: string;
  confirmedBy?: string;
  stillAccurate: boolean;
  notes?: string;
}) {
  const [confirmation] = await db
    .insert(communityConfirmations)
    .values(data)
    .returning();
  return confirmation;
}

export async function getStaleActivities(daysSinceVerification = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysSinceVerification);

  return db.query.activities.findMany({
    where: and(
      eq(activities.published, true),
      sql`${activities.updatedAt} < ${cutoff}`
    ),
    with: {
      verifications: true,
      confirmations: {
        orderBy: desc(communityConfirmations.confirmedAt),
        limit: 1,
      },
    },
  });
}
