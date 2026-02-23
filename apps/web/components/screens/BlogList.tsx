"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Blog } from "@/types/blog";
import { BlogCard } from "../Blog/BlogCard";
import { BlogSearch } from "../Blog/BlogSearch";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";
import type { Category } from "@/constants/categories";
import { Sparkles, BookOpen, TrendingUp } from "lucide-react";

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

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] grain">
        <div className="absolute inset-0 dot-pattern opacity-10"></div>

        <div className="relative container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-slide-up">
              <BookOpen className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                UTAH ADVENTURES & GUIDES
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl text-white mb-6 leading-tight animate-slide-up delay-100">
              Discover Utah
              <span className="block font-serif italic text-white/90 text-4xl lg:text-6xl mt-2">
                One Story at a Time
              </span>
            </h1>

            <p className="font-serif text-xl lg:text-2xl text-white/95 mb-8 max-w-2xl leading-relaxed animate-slide-up delay-200">
              Expert guides, family adventures, and local insights to help you explore the best of the Beehive State.
            </p>

            <div className="flex flex-wrap gap-6 animate-slide-up delay-300">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display">{initialPosts.length}+</div>
                  <div className="text-sm font-medium">Articles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display">Fresh</div>
                  <div className="text-sm font-medium">Weekly Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={colorMode === 'dark' ? 'hsl(15, 25%, 12%)' : 'hsl(45, 35%, 97%)'}
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Search Section */}
        <div className="mb-16">
          <BlogSearch
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Post - Large Hero Card */}
            {featuredPost && (
              <div className="mb-20">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                  <h2 className="font-display text-2xl text-[hsl(var(--foreground))]">
                    Featured Article
                  </h2>
                </div>
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <>
                <div className="mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-[hsl(var(--seasonal-primary))]"></div>
                    <h2 className="font-display text-3xl text-[hsl(var(--foreground))]">
                      Latest Stories
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.meta.slug} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border-2 border-dashed",
              colorMode === "dark"
                ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--border))] text-gray-300"
                : "bg-[hsl(var(--secondary))]/20 border-[hsl(var(--border))] text-gray-600"
            )}
          >
            <div className="max-w-md mx-auto">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-semibold mb-2">No posts found</p>
              <p className="mb-6">
                We couldn't find any posts matching your search criteria.
              </p>
              <button
                onClick={() => {
                  handleSearchChange("");
                  handleCategoryChange([]);
                }}
                className="px-6 py-3 bg-[hsl(var(--seasonal-primary))] text-white font-bold rounded-xl hover:bg-[hsl(var(--seasonal-accent))] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
