import { eq, desc, and, lt } from "drizzle-orm";
import { db } from "../client";
import {
  verifications,
  communityConfirmations,
  activities,
} from "../schema";
import type { trustBadgeEnum } from "../schema";

type TrustBadge = (typeof trustBadgeEnum.enumValues)[number];

export async function getActivityVerifications(activityId: string) {
  return db.query.verifications.findMany({
    where: eq(verifications.activityId, activityId),
    orderBy: desc(verifications.verifiedAt),
  });
}

export async function addVerification(data: {
  activityId: string;
  badge: TrustBadge;
  verifiedBy: string;
  notes?: string;
  expiresInDays?: number;
}) {
  const expiresAt = data.expiresInDays
    ? new Date(Date.now() + data.expiresInDays * 86400000)
    : new Date(Date.now() + 60 * 86400000); // default 60 days

  const [verification] = await db
    .insert(verifications)
    .values({
      activityId: data.activityId,
      badge: data.badge,
      verifiedBy: data.verifiedBy,
      notes: data.notes,
      expiresAt,
    })
    .returning();
  return verification;
}

export async function confirmStillAccurate(data: {
  activityId: string;
  confirmedBy?: string;
  stillAccurate: boolean;
  notes?: string;
}) {
  const [confirmation] = await db
    .insert(communityConfirmations)
    .values(data)
    .returning();

  // If confirmed accurate, bump the activity's updatedAt
  if (data.stillAccurate) {
    await db
      .update(activities)
      .set({ updatedAt: new Date() })
      .where(eq(activities.id, data.activityId));
  }

  return confirmation;
}

export async function getRecentConfirmations(
  activityId: string,
  limit = 5
) {
  return db.query.communityConfirmations.findMany({
    where: eq(communityConfirmations.activityId, activityId),
    orderBy: desc(communityConfirmations.confirmedAt),
    limit,
  });
}

export async function getStaleActivities(daysSinceUpdate = 60) {
  const cutoff = new Date(Date.now() - daysSinceUpdate * 86400000);

  return db.query.activities.findMany({
    where: and(
      eq(activities.published, true),
      lt(activities.updatedAt, cutoff)
    ),
    with: {
      verifications: {
        orderBy: desc(verifications.verifiedAt),
        limit: 1,
      },
      confirmations: {
        orderBy: desc(communityConfirmations.confirmedAt),
        limit: 1,
      },
    },
    orderBy: activities.updatedAt,
  });
}

export async function getActivityTrustScore(activityId: string) {
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, activityId));

  if (!activity) return null;

  const badges = await db.query.verifications.findMany({
    where: eq(verifications.activityId, activityId),
  });

  const confirmations = await db.query.communityConfirmations.findMany({
    where: eq(communityConfirmations.activityId, activityId),
    orderBy: desc(communityConfirmations.confirmedAt),
    limit: 10,
  });

  const activeBadges = badges.filter(
    (b) => !b.expiresAt || b.expiresAt > new Date()
  );

  const recentConfirmations = confirmations.filter(
    (c) =>
      c.confirmedAt > new Date(Date.now() - 60 * 86400000)
  );

  const daysSinceUpdate = Math.floor(
    (Date.now() - activity.updatedAt.getTime()) / 86400000
  );

  return {
    badges: activeBadges.map((b) => b.badge),
    totalConfirmations: confirmations.length,
    recentPositive: recentConfirmations.filter((c) => c.stillAccurate).length,
    recentNegative: recentConfirmations.filter((c) => !c.stillAccurate).length,
    daysSinceUpdate,
    isStale: daysSinceUpdate > 60,
    isFresh: daysSinceUpdate < 30,
  };
}
