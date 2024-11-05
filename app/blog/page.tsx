"use client";
import BlogList from "@/components/screens/BlogList";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { EnhancedLoadingScreen } from "@/components/Loading/EnhancedLoadingScreen";

export default function BlogPage() {
  const { posts, loading, error } = useBlogPosts();

  if (loading) {
    return <EnhancedLoadingScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Posts</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <BlogList initialPosts={posts} />;
}
