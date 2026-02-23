"use server";
import { promises as fs } from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

const rootDirectory = path.join(process.cwd(), "src", "app", "posts");

export const getPostBySlug = async (slug: string) => {
  const filePath = path.join(rootDirectory, `${slug}`, "page.mdx");

  const fileContent = await fs.readFile(filePath, { encoding: "utf8" });

  const meta = (require(`../app/posts/${slug}/page.mdx`) as Record<string, any>)
    .metadata;

  const { content } = await compileMDX({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return { meta, content };
};

export const getAllPostsMeta = async () => {
  const files = (await fs.readdir(rootDirectory)).filter(
    (file) => !(file.endsWith(".DS_Store") || file.endsWith(".tsx"))
  );

  const posts = [];

  for (const file of files) {
    const { meta } = await getPostBySlug(file);
    posts.push(meta);
  }

  return posts;
};
