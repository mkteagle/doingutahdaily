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

export async function getPublishedPostSummaries(limit?: number) {
  return db.query.posts.findMany({
    columns: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      author: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    where: eq(posts.published, true),
    with: { categories: { columns: { name: true } } },
    orderBy: [sql`${posts.publishedAt} DESC NULLS LAST`, desc(posts.createdAt), desc(posts.slug)],
    limit,
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.published, true)),
    with: { categories: true },
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

  return db.transaction(async (transaction) => {
    const [post] = await transaction
      .insert(posts)
      .values({
        ...rest,
        excerpt: rest.excerpt ?? "",
        scheduledAt,
        publishedAt: rest.published ? new Date() : null,
      })
      .returning();

    if (cats?.length) {
      await transaction.insert(postCategories)
        .values([...new Set(cats)].map((name) => ({ postId: post.id, name })));
    }

    return transaction.query.posts.findFirst({
      where: eq(posts.id, post.id),
      with: { categories: true },
    });
  });
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
    updateData.publishedAt = rest.published ? sql`coalesce(${posts.publishedAt}, now())` : null;
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

  return db.transaction(async (transaction) => {
    const [updated] = await transaction.update(posts).set(updateData)
      .where(eq(posts.id, id)).returning({ id: posts.id });
    if (!updated) return undefined;

    if (cats !== undefined) {
      await transaction.delete(postCategories).where(eq(postCategories.postId, id));
      if (cats.length) {
        await transaction.insert(postCategories)
          .values([...new Set(cats)].map((name) => ({ postId: id, name })));
      }
    }

    return transaction.query.posts.findFirst({
      where: eq(posts.id, id),
      with: { categories: true },
    });
  });
}

export async function deletePost(id: string) {
  return db.delete(posts).where(eq(posts.id, id));
}

export async function publishScheduledPosts(now = new Date()) {
  return db.update(posts)
    .set({ published: true, publishedAt: new Date(), scheduledAt: null })
    .where(and(eq(posts.published, false), isNotNull(posts.scheduledAt), lte(posts.scheduledAt, now)))
    .returning({ id: posts.id });
}
