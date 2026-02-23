import { prisma } from "../client";

export async function getAllPosts() {
  return prisma.post.findMany({
    include: { categories: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    include: { categories: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { categories: true },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { categories: true },
  });
}

export async function getPostsByCategory(category: string) {
  return prisma.post.findMany({
    where: {
      published: true,
      categories: { some: { name: category } },
    },
    include: { categories: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getCategoryStats(categoryNames: string[]) {
  const stats = await Promise.all(
    categoryNames.map(async (name) => {
      const count = await prisma.post.count({
        where: {
          published: true,
          categories: { some: { name } },
        },
      });
      return { name, count };
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
  categories?: string[];
}) {
  const { categories, ...rest } = data;
  return prisma.post.create({
    data: {
      ...rest,
      excerpt: rest.excerpt ?? "",
      publishedAt: rest.published ? new Date() : null,
      categories: {
        create: (categories ?? []).map((name) => ({ name })),
      },
    },
    include: { categories: true },
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
    categories?: string[];
  }
) {
  const { categories, ...rest } = data;

  if (categories !== undefined) {
    await prisma.postCategory.deleteMany({ where: { postId: id } });
  }

  return prisma.post.update({
    where: { id },
    data: {
      ...rest,
      publishedAt:
        rest.published !== undefined
          ? rest.published
            ? new Date()
            : null
          : undefined,
      ...(categories !== undefined && {
        categories: {
          create: categories.map((name) => ({ name })),
        },
      }),
    },
    include: { categories: true },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
