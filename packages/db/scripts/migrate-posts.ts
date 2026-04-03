/**
 * Migrate MDX blog posts to the database.
 * Run with: pnpm --filter db migrate-posts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import matter from "gray-matter";
import { readFileSync, readdirSync } from "fs";
import { join, basename, resolve } from "path";
import { fileURLToPath } from "url";
import * as schema from "../src/schema";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const BLOG_DIR = resolve(__dirname, "../../../apps/web/content/blog");

async function main() {
  const files = readdirSync(BLOG_DIR).filter(
    (f) => f.endsWith(".mdx") || f.endsWith(".md")
  );

  console.log(`Found ${files.length} posts to migrate\n`);

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const ext = file.endsWith(".mdx") ? ".mdx" : ".md";
    const slug = basename(file, ext);
    const raw = readFileSync(join(BLOG_DIR, file), "utf-8");
    const { data: fm, content } = matter(raw);

    const existing = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
    });

    if (existing) {
      console.log(`  skip  ${slug}`);
      skipped++;
      continue;
    }

    const [post] = await db
      .insert(schema.posts)
      .values({
        slug,
        title: fm.title ?? slug,
        excerpt: fm.excerpt ?? null,
        content: content.trim(),
        coverImage: fm.coverImage || null,
        author: fm.author?.name ?? "Doing Utah Daily",
        published: true,
        publishedAt: fm.date ? new Date(fm.date) : null,
      })
      .returning({ id: schema.posts.id });

    const categories: string[] = fm.categories ?? [];
    if (categories.length > 0) {
      await db.insert(schema.postCategories).values(
        categories.map((name) => ({ postId: post.id, name }))
      );
    }

    console.log(`  ok    ${slug}  [${categories.join(", ")}]`);
    inserted++;
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
