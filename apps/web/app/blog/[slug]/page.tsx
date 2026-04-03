import { notFound } from "next/navigation";
import { postService } from "@dud/db";
import { serialize } from "next-mdx-remote/serialize";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { BlogPost } from "@/components/screens/BlogPost";
import type { Blog, Category } from "@/types/blog";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Blog | null> {
  const post = await postService.getPostBySlug(slug);
  if (!post) return null;

  let content;
  try {
    content = await serialize(post.content, { parseFrontmatter: false });
  } catch {
    content = await serialize("*This post could not be rendered.*");
  }

  return {
    meta: {
      slug: post.slug,
      title: post.title,
      date: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
      excerpt: post.excerpt ?? "",
      author: { name: post.author },
      coverImage: post.coverImage ?? undefined,
      categories: post.categories.map((c) => c.name) as Category[],
      readingTime: calculateReadingTime(post.content),
    },
    content,
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for could not be found.",
    };
  }

  const { meta } = post;
  const url = `https://doingutahdaily.com/blog/${slug}`;
  const imageUrl = meta.coverImage || "/apple-icon.png";
  const description =
    meta.excerpt ||
    `Read about ${meta.title} on Doing Utah Daily - your guide to Utah family adventures and events`;

  return {
    title: meta.title,
    description,
    keywords: meta.categories || [],
    authors: [{ name: meta.author?.name ?? "Doing Utah Daily" }],
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description,
      publishedTime: meta.date,
      authors: [meta.author?.name ?? "Doing Utah Daily"],
      tags: meta.categories || [],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description,
      images: [imageUrl],
      creator: "@doingutahdaily",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <BlogPost post={post} />;
}
