"use client";
import { MDXRemote } from "next-mdx-remote";
import { BlogPostHero } from "../Blog/BlogPostHero";
import type { Blog } from "@/types/blog";
import { useMDXComponents } from "@/app/mdxComponents";
import { CategoriesWidget } from "../Blog/CategoryWidget";
import { useRouter } from "next/navigation";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { BlogSearchBar } from "../Blog/BlogSearchBar";
import { LoadingSpinner } from "../Loading/LoadingSpinner";
import { useCategoryStats } from "@/hooks/useGetCategoriesStats";
import { ArrowLeft, Share2, BookOpen, Clock } from "lucide-react";

interface BlogPostLayoutProps {
  post: Blog;
}

export function BlogPostLayout({ post }: BlogPostLayoutProps) {
  const components = useMDXComponents();
  const router = useRouter();
  const { colorMode } = useTheme();
  const { categoryStats, loading: statsLoading } = useCategoryStats();

  return (
    <>
      <BlogPostHero
        title={post.meta.title}
        date={post.meta.date}
        author={post.meta.author}
        coverImage={post.meta.coverImage}
        categories={post.meta.categories}
        readingTime={post.meta.readingTime}
        slug={post.meta.slug}
      />

      {/* Floating back button */}
      <div className="sticky top-24 z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <button
            onClick={() => router.push("/blog")}
            className={cn(
              "group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-lg",
              colorMode === "dark"
                ? "bg-[hsl(var(--foreground))] text-white hover:bg-[hsl(var(--seasonal-primary))]"
                : "bg-white text-[hsl(var(--foreground))] hover:bg-[hsl(var(--seasonal-primary))] hover:text-white"
            )}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main content area */}
          <div className="lg:col-span-8">
            {/* Article metadata bar */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-4 mb-8 pb-6 border-b-2",
                colorMode === "dark"
                  ? "border-[hsl(var(--border))]"
                  : "border-[hsl(var(--seasonal-primary))]/20"
              )}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="w-4 h-4 text-[hsl(var(--seasonal-primary))]" />
                <span
                  className={cn(
                    colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  By {post.meta.author.name}
                </span>
              </div>
              {post.meta.readingTime && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4 text-[hsl(var(--seasonal-primary))]" />
                  <span
                    className={cn(
                      colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {post.meta.readingTime}
                  </span>
                </div>
              )}
              <button
                className={cn(
                  "ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors",
                  colorMode === "dark"
                    ? "bg-[hsl(var(--seasonal-primary))]/20 text-[hsl(var(--seasonal-primary))] hover:bg-[hsl(var(--seasonal-primary))]/30"
                    : "bg-[hsl(var(--seasonal-primary))]/10 text-[hsl(var(--seasonal-primary))] hover:bg-[hsl(var(--seasonal-primary))]/20"
                )}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Article content with enhanced typography */}
            <article
              className={cn(
                "prose lg:prose-xl max-w-none",
                "prose-headings:font-display prose-headings:leading-tight",
                "prose-p:font-serif prose-p:leading-relaxed prose-p:text-lg",
                "prose-a:text-[hsl(var(--seasonal-primary))] prose-a:no-underline prose-a:font-bold hover:prose-a:underline",
                "prose-blockquote:border-l-4 prose-blockquote:border-[hsl(var(--seasonal-primary))] prose-blockquote:bg-[hsl(var(--seasonal-secondary))]/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-serif",
                "prose-strong:text-[hsl(var(--seasonal-primary))] prose-strong:font-bold",
                "prose-code:bg-[hsl(var(--seasonal-secondary))]/30 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm",
                "prose-pre:bg-[hsl(var(--foreground))]/5 prose-pre:border-2 prose-pre:border-[hsl(var(--border))] prose-pre:rounded-xl",
                "prose-img:rounded-2xl prose-img:shadow-layered",
                "prose-hr:border-[hsl(var(--seasonal-primary))]/30 prose-hr:border-t-2",
                "prose-li:marker:text-[hsl(var(--seasonal-primary))]",
                colorMode === "dark"
                  ? "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300"
                  : "prose-headings:text-[hsl(var(--foreground))] prose-p:text-gray-700 prose-li:text-gray-700"
              )}
            >
              <MDXRemote {...post.content} components={components} />
            </article>

            {/* Author bio section */}
            <div
              className={cn(
                "mt-16 p-8 rounded-2xl border-2",
                colorMode === "dark"
                  ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--border))]"
                  : "bg-[hsl(var(--seasonal-secondary))]/20 border-[hsl(var(--seasonal-primary))]/20"
              )}
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] flex items-center justify-center text-white font-display text-2xl flex-shrink-0"
                >
                  {post.meta.author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-2">
                    {post.meta.author.name}
                  </h3>
                  <p
                    className={cn(
                      "font-serif leading-relaxed",
                      colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    Utah adventure enthusiast and family activities expert. Passionate about sharing the best
                    experiences the Beehive State has to offer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Quick search */}
              <div>
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-[hsl(var(--seasonal-primary))]"></div>
                  Search Posts
                </h3>
                <BlogSearchBar />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-[hsl(var(--seasonal-primary))]"></div>
                  Categories
                </h3>
                {statsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <CategoriesWidget categories={categoryStats} />
                )}
              </div>

              {/* Ad space / CTA */}
              <div
                className={cn(
                  "p-8 rounded-2xl text-center grain relative overflow-hidden",
                  "bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))]"
                )}
              >
                <div className="absolute inset-0 dot-pattern opacity-10"></div>
                <div className="relative">
                  <h3 className="font-display text-2xl text-white mb-3">
                    Love Utah Adventures?
                  </h3>
                  <p className="font-serif text-white/90 mb-6">
                    Get weekly guides and exclusive family-friendly event updates!
                  </p>
                  <button className="w-full px-6 py-3 bg-white text-[hsl(var(--seasonal-primary))] font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
