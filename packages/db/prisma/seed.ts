import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing posts
  await prisma.postCategory.deleteMany({});
  await prisma.post.deleteMany({});

  const postsDir = path.join(
    process.cwd(),
    "../../apps/web/content/blog"
  );

  const files = await fs.readdir(postsDir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  console.log(`Found ${mdxFiles.length} MDX files`);

  for (const file of mdxFiles) {
    const filePath = path.join(postsDir, file);
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: mdxContent } = matter(content);

    const slug = file.replace(/\.mdx$/, "");

    console.log(`Migrating: ${slug}`);

    const post = await prisma.post.create({
      data: {
        slug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: mdxContent,
        coverImage: data.coverImage || null,
        author: data.author?.name || "Doing Utah Daily",
        published: true,
        publishedAt: data.date ? new Date(data.date) : new Date(),
        categories: {
          create: (data.categories || []).map((name: string) => ({ name })),
        },
      },
    });

    console.log(`✓ Created post: ${post.id}`);
  }

  console.log("Seed complete!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
