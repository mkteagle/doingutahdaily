"use client";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { useRouter } from "next/navigation";
import { EnhancedLoadingScreen } from "../Loading/EnhancedLoadingScreen";
import { BlogPostLayout } from "@/components/Blog/BlogPostLayout";

export function BlogPost({ slug }: { slug: string }) {
  const router = useRouter();
  const { post, loading, error } = useBlogPost(slug);

  if (loading) {
    return <EnhancedLoadingScreen />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-8">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/blog")}
          className="text-primary hover:underline"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return <BlogPostLayout post={post} />;
}
