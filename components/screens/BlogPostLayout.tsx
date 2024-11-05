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
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main content area */}
          <div className="lg:col-span-8">
            <article
              className={cn(
                "prose lg:prose-xl max-w-none",
                "rounded-lg p-8",
                "transition-colors duration-200",
                "mx-auto"
              )}
            >
              <MDXRemote {...post.content} components={components} />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 gap-16 flex-col flex">
              <BlogSearchBar />
              {statsLoading ? (
                <LoadingSpinner />
              ) : (
                <CategoriesWidget categories={categoryStats} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
