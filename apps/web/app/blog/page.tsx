import BlogList from "@/components/screens/BlogList";
import { postService } from "@dud/db";
import { calculateReadingTime } from "@/utils/blogHelpers";
import type { Metadata } from "next";
import type { Blog, Category } from "@/types/blog";

export const metadata: Metadata = {
  title: "Blog - Utah Family Adventures & Event Guides",
  description: "Discover the best things to do in Utah with our comprehensive guides, seasonal activity ideas, and insider tips for families exploring the Beehive State.",
  keywords: ["Utah blog", "Utah family blog", "Utah travel blog", "things to do Utah", "Utah activities blog", "Utah family adventures"],
  openGraph: {
    title: "Blog - Utah Family Adventures & Event Guides",
    description: "Discover the best things to do in Utah with our comprehensive guides, seasonal activity ideas, and insider tips for families.",
    url: "https://doingutahdaily.com/blog",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Utah Family Adventures & Event Guides",
    description: "Discover the best things to do in Utah with our comprehensive guides, seasonal activity ideas, and insider tips for families."
  }
};

export default async function BlogPage() {
  const posts = await postService.getPublishedPosts();

  const blogPosts: Blog[] = posts.map((post) => ({
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
    content: null,
  }));

  return <BlogList initialPosts={blogPosts} />;
}
