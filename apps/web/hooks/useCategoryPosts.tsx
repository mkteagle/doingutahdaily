"use client";
import { useState, useEffect } from "react";
import type { Blog } from "@/types/blog";

export function useCategoryPosts(category: string) {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/categories/${category}`);
        if (!response.ok) throw new Error("Failed to fetch category posts");
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category posts"
        );
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchPosts();
    }
  }, [category]);

  return { posts, loading, error };
}
