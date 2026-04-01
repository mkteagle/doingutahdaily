import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "./utils";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const platformEnum = pgEnum("platform", ["instagram", "tiktok"]);
export const mediaTypeEnum = pgEnum("media_type", [
  "IMAGE",
  "VIDEO",
  "CAROUSEL",
]);
export const trustBadgeEnum = pgEnum("trust_badge", [
  "actually_went",
  "still_free",
  "verified_open",
]);
export const ageBandEnum = pgEnum("age_band", [
  "0-2",
  "3-5",
  "6-8",
  "9-11",
  "12-14",
  "15-17",
  "all_ages",
]);
export const costTierEnum = pgEnum("cost_tier", [
  "free",
  "budget",
  "moderate",
  "premium",
]);

// ─── Existing Models (migrated from Prisma) ──────────────────────────────

export const posts = pgTable(
  "Post",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("coverImage"),
    author: text("author").notNull().default("Doing Utah Daily"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("publishedAt"),
    scheduledAt: timestamp("scheduledAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("Post_publishedAt_idx").on(t.publishedAt),
    index("Post_scheduledAt_idx").on(t.scheduledAt),
  ]
);

export const postCategories = pgTable(
  "PostCategory",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    postId: text("postId")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
  },
  (t) => [
    unique("PostCategory_postId_name_key").on(t.postId, t.name),
    index("PostCategory_postId_idx").on(t.postId),
  ]
);

export const socialPosts = pgTable(
  "SocialPost",
  {
    id: text("id").primaryKey(),
    platform: platformEnum("platform").notNull(),
    mediaUrl: text("mediaUrl"),
    thumbnailUrl: text("thumbnailUrl"),
    caption: text("caption"),
    permalink: text("permalink").notNull(),
    mediaType: mediaTypeEnum("mediaType"),
    timestamp: timestamp("timestamp").notNull(),
    cachedAt: timestamp("cachedAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("SocialPost_platform_idx").on(t.platform),
    index("SocialPost_timestamp_idx").on(t.timestamp),
  ]
);

export const events = pgTable(
  "Event",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    startTime: timestamp("startTime").notNull(),
    endTime: timestamp("endTime"),
    location: text("location"),
    categories: text("categories").array().notNull().default([]),
    sourceId: text("sourceId"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("Event_startTime_idx").on(t.startTime),
    index("Event_sourceId_idx").on(t.sourceId),
  ]
);

// ─── New: Activities (core DUD data model) ───────────────────────────────

export const activities = pgTable(
  "activities",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    shortDescription: text("short_description"),

    // Location
    address: text("address"),
    city: text("city").notNull().default("Salt Lake City"),
    region: text("region").notNull().default("SLC Metro"),
    latitude: text("latitude"),
    longitude: text("longitude"),

    // Logistics
    costTier: costTierEnum("cost_tier").notNull().default("free"),
    priceNotes: text("price_notes"),
    duration: text("duration"),
    bestTime: text("best_time"),
    parking: text("parking"),
    restrooms: boolean("restrooms"),
    strollerFriendly: boolean("stroller_friendly"),
    wheelchairAccessible: boolean("wheelchair_accessible"),

    // Contact
    website: text("website"),
    phone: text("phone"),
    email: text("email"),

    // Content
    coverImage: text("cover_image"),
    images: text("images").array().default([]),

    // Meta
    published: boolean("published").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    sourceUrl: text("source_url"),
    submittedBy: text("submitted_by"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("activities_city_idx").on(t.city),
    index("activities_region_idx").on(t.region),
    index("activities_cost_tier_idx").on(t.costTier),
    index("activities_published_idx").on(t.published),
  ]
);

export const activityAgeBands = pgTable(
  "activity_age_bands",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    ageBand: ageBandEnum("age_band").notNull(),
    notes: text("notes"),
  },
  (t) => [
    unique("activity_age_band_unique").on(t.activityId, t.ageBand),
    index("activity_age_bands_activity_idx").on(t.activityId),
    index("activity_age_bands_age_idx").on(t.ageBand),
  ]
);

export const activityCategories = pgTable(
  "activity_categories",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
  },
  (t) => [
    unique("activity_category_unique").on(t.activityId, t.category),
    index("activity_categories_activity_idx").on(t.activityId),
    index("activity_categories_category_idx").on(t.category),
  ]
);

export const activityTags = pgTable(
  "activity_tags",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => [
    unique("activity_tag_unique").on(t.activityId, t.tag),
    index("activity_tags_tag_idx").on(t.tag),
  ]
);

export const activitySeasons = pgTable(
  "activity_seasons",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    season: text("season").notNull(), // spring, summer, fall, winter, year-round
  },
  (t) => [
    unique("activity_season_unique").on(t.activityId, t.season),
  ]
);

// ─── Trust & Verification ────────────────────────────────────────────────

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    badge: trustBadgeEnum("badge").notNull(),
    verifiedBy: text("verified_by").notNull(),
    verifiedAt: timestamp("verified_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
    notes: text("notes"),
  },
  (t) => [
    index("verifications_activity_idx").on(t.activityId),
    index("verifications_badge_idx").on(t.badge),
    index("verifications_expires_idx").on(t.expiresAt),
  ]
);

export const communityConfirmations = pgTable(
  "community_confirmations",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    confirmedAt: timestamp("confirmed_at").notNull().defaultNow(),
    confirmedBy: text("confirmed_by"),
    stillAccurate: boolean("still_accurate").notNull().default(true),
    notes: text("notes"),
  },
  (t) => [
    index("community_confirmations_activity_idx").on(t.activityId),
  ]
);

// ─── Newsletter Subscribers ──────────────────────────────────────────────

export const subscribers = pgTable(
  "subscribers",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    regions: text("regions").array().default([]),
    ageBands: text("age_bands").array().default([]),
    active: boolean("active").notNull().default(true),
    subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at"),
  },
  (t) => [index("subscribers_active_idx").on(t.active)]
);

// ─── Venue/Activity Submissions ──────────────────────────────────────────

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
  "needs_info",
]);

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").$defaultFn(createId).primaryKey(),
    status: submissionStatusEnum("status").notNull().default("pending"),

    // Submitter info
    submitterName: text("submitter_name").notNull(),
    submitterEmail: text("submitter_email").notNull(),
    submitterRole: text("submitter_role"), // owner, organizer, visitor, other
    businessName: text("business_name"),

    // Activity details
    title: text("title").notNull(),
    description: text("description"),
    address: text("address"),
    city: text("city"),
    website: text("website"),
    phone: text("phone"),

    // Classification
    categories: text("categories").array().default([]),
    ageBands: text("age_bands").array().default([]),
    costTier: text("cost_tier"),
    isFree: boolean("is_free").notNull().default(false),

    // Logistics
    duration: text("duration"),
    parking: text("parking"),
    restrooms: boolean("restrooms"),
    strollerFriendly: boolean("stroller_friendly"),
    wheelchairAccessible: boolean("wheelchair_accessible"),

    // Admin
    reviewNotes: text("review_notes"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at"),
    activityId: text("activity_id").references(() => activities.id),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("submissions_status_idx").on(t.status),
    index("submissions_email_idx").on(t.submitterEmail),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────

export const postsRelations = relations(posts, ({ many }) => ({
  categories: many(postCategories),
}));

export const postCategoriesRelations = relations(
  postCategories,
  ({ one }) => ({
    post: one(posts, {
      fields: [postCategories.postId],
      references: [posts.id],
    }),
  })
);

export const activitiesRelations = relations(activities, ({ many }) => ({
  ageBands: many(activityAgeBands),
  categories: many(activityCategories),
  tags: many(activityTags),
  seasons: many(activitySeasons),
  verifications: many(verifications),
  confirmations: many(communityConfirmations),
}));

export const activityAgeBandsRelations = relations(
  activityAgeBands,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityAgeBands.activityId],
      references: [activities.id],
    }),
  })
);

export const activityCategoriesRelations = relations(
  activityCategories,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityCategories.activityId],
      references: [activities.id],
    }),
  })
);

export const activityTagsRelations = relations(activityTags, ({ one }) => ({
  activity: one(activities, {
    fields: [activityTags.activityId],
    references: [activities.id],
  }),
}));

export const activitySeasonsRelations = relations(
  activitySeasons,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activitySeasons.activityId],
      references: [activities.id],
    }),
  })
);

export const verificationsRelations = relations(verifications, ({ one }) => ({
  activity: one(activities, {
    fields: [verifications.activityId],
    references: [activities.id],
  }),
}));

export const communityConfirmationsRelations = relations(
  communityConfirmations,
  ({ one }) => ({
    activity: one(activities, {
      fields: [communityConfirmations.activityId],
      references: [activities.id],
    }),
  })
);
