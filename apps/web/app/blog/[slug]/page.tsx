import { cache } from "react";
import { notFound } from "next/navigation";
import { postService } from "@dud/db";
import type { Metadata } from "next";
import { BlogPost } from "@/components/screens/BlogPost";
import { calculateReadingTime } from "@/utils/blogHelpers";
import { compileStoryMdx } from "@/lib/storyMdx";
import { SITE_URL } from "@/lib/site";
import type { BlogMeta, Category } from "@/types/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const getPost = cache(postService.getPublishedPostBySlug);

function articleUrl(slug: string) {
  return `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Story unavailable", robots: { index: false, follow: true } };

  const url = articleUrl(post.slug);
  const image = post.coverImage || "/images/field-guide-hero.webp";
  const description = post.excerpt || "Find family outings and first-hand local stories from Doing Utah Daily.";

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      tags: post.categories.map(({ name }) => name),
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [{ url: image, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [body, archive] = await Promise.all([
    compileStoryMdx(post.content).catch((error: unknown) => {
      console.error("Failed to compile article", post.slug, error instanceof Error ? error.message : "");
      return { content: <p>This story is temporarily unavailable.</p>, headings: [] };
    }),
    postService.getPublishedPostSummaries(),
  ]);

  const date = (post.publishedAt ?? post.createdAt).toISOString();
  const url = articleUrl(post.slug);
  const categories = post.categories.map(({ name }) => name) as Category[];
  const related = archive
    .filter((entry) => entry.slug !== post.slug)
    .sort((a, b) => Number(b.categories.some(({ name }) => categories.includes(name as Category)))
      - Number(a.categories.some(({ name }) => categories.includes(name as Category))))
    .slice(0, 3);
  const meta: BlogMeta = {
    slug: post.slug,
    title: post.title,
    date,
    excerpt: post.excerpt ?? "",
    author: { name: post.author },
    coverImage: post.coverImage ?? undefined,
    categories,
    readingTime: calculateReadingTime(post.content),
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url + "#article",
        mainEntityOfPage: url,
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.coverImage ? [new URL(post.coverImage, SITE_URL).href] : undefined,
        datePublished: date,
        dateModified: post.updatedAt.toISOString(),
        author: post.author === "Doing Utah Daily"
          ? { "@type": "Organization", name: post.author, url: SITE_URL + "/about" }
          : { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: "Doing Utah Daily", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Stories", item: SITE_URL + "/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <BlogPost meta={meta} sections={body.headings} related={related}>{body.content}</BlogPost>
    </>
  );
}
