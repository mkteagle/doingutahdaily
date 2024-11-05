"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Blog } from "@/types/blog";
import { BlogCard } from "../Blog/BlogCard";
import { BlogSearch } from "../Blog/BlogSearch";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";
import type { Category } from "@/constants/categories";

interface BlogListProps {
  initialPosts: Blog[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const { colorMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams?.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    (searchParams
      ?.get("categories")
      ?.split(",")
      .filter(Boolean) as Category[]) || []
  );

  // Update URL params while preserving other params
  const updateUrlParams = (search: string | null, categories: Category[]) => {
    const params = new URLSearchParams(searchParams?.toString());

    // Handle search param
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    // Handle categories param
    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    } else {
      params.delete("categories");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "/blog";
    router.push(newUrl, { scroll: false });
  };

  // Handle search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrlParams(value || null, selectedCategories);
  };

  // Handle category changes
  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories);
    updateUrlParams(searchQuery || null, categories);
  };

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.meta.title.toLowerCase().includes(query) ||
          post.meta.excerpt.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      posts = posts.filter((post) =>
        post.meta.categories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    return posts;
  }, [initialPosts, searchQuery, selectedCategories]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1
        className={cn(
          "text-4xl font-bold mb-4",
          colorMode === "dark" ? "text-white" : "text-gray-900"
        )}
      >
        Our Blog
      </h1>
      <p
        className={cn(
          "text-xl mb-12 max-w-2xl",
          colorMode === "dark" ? "text-gray-300" : "text-gray-600"
        )}
      >
        Discover the best family-friendly activities, events, and adventures
        across Utah through our detailed guides and personal experiences.
      </p>

      <BlogSearch
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
      />

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.meta.slug} post={post} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "text-center py-12 rounded-lg",
            colorMode === "dark"
              ? "bg-gray-900/50 text-gray-300"
              : "bg-white/50 text-gray-600"
          )}
        >
          <p className="text-lg">
            No posts found matching your search criteria.
          </p>
          <button
            onClick={() => {
              handleSearchChange("");
              handleCategoryChange([]);
            }}
            className={cn(
              "mt-4 text-sm underline-offset-4 hover:underline",
              "text-primary hover:text-primary/80"
            )}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
