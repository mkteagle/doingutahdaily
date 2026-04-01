import { eq, desc, and, sql, lte, isNotNull } from "drizzle-orm";
import { db } from "../client";
import { posts, postCategories } from "../schema";

export async function getAllPosts() {
  return db.query.posts.findMany({
    with: { categories: true },
    orderBy: desc(posts.updatedAt),
  });
}

export async function getPublishedPosts() {
  return db.query.posts.findMany({
    where: eq(posts.published, true),
    with: { categories: true },
    orderBy: desc(posts.publishedAt),
  });
}

export async function getPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: { categories: true },
  });
}

export async function getPostById(id: string) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: { categories: true },
  });
}

export async function getPostsByCategory(category: string) {
  const matchingPostIds = db
    .select({ postId: postCategories.postId })
    .from(postCategories)
    .where(eq(postCategories.name, category));

  return db.query.posts.findMany({
    where: and(
      eq(posts.published, true),
      sql`${posts.id} IN (${matchingPostIds})`
    ),
    with: { categories: true },
    orderBy: desc(posts.publishedAt),
  });
}

export async function getCategoryStats(categoryNames: readonly string[]) {
  const stats = await Promise.all(
    categoryNames.map(async (name) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(postCategories)
        .innerJoin(posts, eq(postCategories.postId, posts.id))
        .where(
          and(eq(postCategories.name, name), eq(posts.published, true))
        );
      return { name, count: Number(result[0]?.count ?? 0) };
    })
  );
  return stats;
}

export async function createPost(data: {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  published?: boolean;
  scheduledAt?: Date | null;
  categories?: string[];
}) {
  const { categories: cats, ...rest } = data;
  const scheduledAt = rest.published ? null : rest.scheduledAt ?? null;

  const [post] = await db
    .insert(posts)
    .values({
      ...rest,
      excerpt: rest.excerpt ?? "",
      scheduledAt,
      publishedAt: rest.published ? new Date() : null,
    })
    .returning();

  if (cats?.length) {
    await db
      .insert(postCategories)
      .values(cats.map((name) => ({ postId: post.id, name })));
  }

  return getPostById(post.id);
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string | null;
    published?: boolean;
    scheduledAt?: Date | null;
    categories?: string[];
  }
) {
  const { categories: cats, ...rest } = data;

  const updateData: Record<string, unknown> = { ...rest };
  if (rest.published !== undefined) {
    updateData.publishedAt = rest.published ? new Date() : null;
    if (rest.published) {
      updateData.scheduledAt = null;
    }
  }

  if (rest.scheduledAt !== undefined) {
    updateData.scheduledAt = rest.scheduledAt;
    if (rest.scheduledAt) {
      updateData.published = false;
      updateData.publishedAt = null;
    }
  }

  await db.update(posts).set(updateData).where(eq(posts.id, id));

  if (cats !== undefined) {
    await db.delete(postCategories).where(eq(postCategories.postId, id));
    if (cats.length) {
      await db
        .insert(postCategories)
        .values(cats.map((name) => ({ postId: id, name })));
    }
  }

  return getPostById(id);
}

export async function deletePost(id: string) {
  return db.delete(posts).where(eq(posts.id, id));
}

export async function publishScheduledPosts(now = new Date()) {
  const duePosts = await db.query.posts.findMany({
    where: and(
      eq(posts.published, false),
      isNotNull(posts.scheduledAt),
      lte(posts.scheduledAt, now)
    ),
    with: { categories: true },
    orderBy: desc(posts.scheduledAt),
  });

  if (!duePosts.length) {
    return [];
  }

  const publishedAt = new Date();

  await db
    .update(posts)
    .set({
      published: true,
      publishedAt,
      scheduledAt: null,
    })
    .where(
      and(
        eq(posts.published, false),
        isNotNull(posts.scheduledAt),
        lte(posts.scheduledAt, now)
      )
    );

  return duePosts;
}
