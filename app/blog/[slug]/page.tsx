import { BlogPost } from "@/components/screens/BlogPost";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/blogUtils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for could not be found."
    };
  }

  const { meta } = post;
  const url = `https://doingutahdaily.com/blog/${slug}`;
  const imageUrl = meta.coverImage || '/apple-icon.png';

  const description = meta.excerpt || `Read about ${meta.title} on Doing Utah Daily - your guide to Utah family adventures and events`;

  return {
    title: meta.title,
    description,
    keywords: meta.categories || [],
    authors: meta.author ? [{ name: meta.author.name }] : [{ name: "Doing Utah Daily" }],
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description,
      publishedTime: meta.date,
      authors: meta.author ? [meta.author.name] : ["Doing Utah Daily"],
      tags: meta.categories || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: meta.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description,
      images: [imageUrl],
      creator: "@doingutahdaily"
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = (await params).slug;
  return <BlogPost slug={slug} />;
}
