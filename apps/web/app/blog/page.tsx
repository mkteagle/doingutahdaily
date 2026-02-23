import BlogList from "@/components/screens/BlogList";
import type { Metadata } from "next";

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
  // Fetch posts server-side for better SEO
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/blog`, { cache: 'no-store' });
  const data = await response.json();
  const posts = data.posts || [];

  return <BlogList initialPosts={posts} />;
}
