"use client";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/blog";
import { useTheme } from "@/theme/theme";
import { OptimizedImage } from "../OptimizedImage";

interface BlogCardProps {
  post: Blog;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { colorMode } = useTheme();

  if (featured) {
    // Large featured card layout
    return (
      <Link
        href={`/blog/${post.meta.slug}`}
        className={cn(
          "group relative rounded-3xl overflow-hidden border-2 transition-all hover-lift shadow-layered",
          colorMode === "dark"
            ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30 hover:border-[hsl(var(--seasonal-primary))]"
            : "bg-white border-[hsl(var(--seasonal-primary))]/20 hover:border-[hsl(var(--seasonal-primary))]"
        )}
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] opacity-10 -rotate-45 translate-x-16 -translate-y-16"></div>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
            <OptimizedImage
              src={post.meta.coverImage || "/images/placeholder.jpg"}
              alt={post.meta.title}
              category={post.meta.categories[0]}
              slug={post.meta.slug}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={true}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent lg:bg-gradient-to-r"></div>

            {/* Categories on image */}
            {post.meta.categories && post.meta.categories.length > 0 && (
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {post.meta.categories.slice(0, 2).map((category) => (
                  <CategoryBadge
                    key={category}
                    category={category}
                    size="md"
                    isDarkBackground={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                <User className="w-4 h-4 text-[hsl(var(--seasonal-primary))]" />
                <span>{post.meta.author.name}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                <Calendar className="w-4 h-4 text-[hsl(var(--seasonal-primary))]" />
                <span>{new Date(post.meta.date).toLocaleDateString()}</span>
              </div>
              {post.meta.readingTime && (
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  <Clock className="w-4 h-4 text-[hsl(var(--seasonal-primary))]" />
                  <span>{post.meta.readingTime}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2
              className={cn(
                "font-display text-3xl lg:text-4xl mb-4 leading-tight group-hover:text-[hsl(var(--seasonal-primary))] transition-colors",
                colorMode === "dark" ? "text-white" : "text-[hsl(var(--foreground))]"
              )}
            >
              {post.meta.title}
            </h2>

            {/* Excerpt */}
            <p
              className={cn(
                "font-serif text-lg mb-6 line-clamp-3 leading-relaxed",
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              {post.meta.excerpt}
            </p>

            {/* Read More */}
            <div className="inline-flex items-center gap-2 text-[hsl(var(--seasonal-primary))] font-bold text-lg group/btn">
              Read Full Story
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Regular card layout
  return (
    <Link
      href={`/blog/${post.meta.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all hover-lift shadow-lg h-full",
        colorMode === "dark"
          ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30 hover:border-[hsl(var(--seasonal-primary))]"
          : "bg-white border-[hsl(var(--seasonal-primary))]/20 hover:border-[hsl(var(--seasonal-primary))]"
      )}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] opacity-10 -rotate-45 translate-x-12 -translate-y-12 group-hover:opacity-20 transition-opacity"></div>

      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={post.meta.coverImage || "/images/placeholder.jpg"}
          alt={post.meta.title}
          category={post.meta.categories[0]}
          slug={post.meta.slug}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Categories on image */}
        {post.meta.categories && post.meta.categories.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {post.meta.categories.slice(0, 2).map((category) => (
              <CategoryBadge
                key={category}
                category={category}
                size="sm"
                isDarkBackground={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 flex-1">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          <div
            className={cn(
              "flex items-center gap-1.5 font-medium",
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            <Calendar className="w-3.5 h-3.5 text-[hsl(var(--seasonal-primary))]" />
            <span>{new Date(post.meta.date).toLocaleDateString()}</span>
          </div>
          {post.meta.readingTime && (
            <div
              className={cn(
                "flex items-center gap-1.5 font-medium",
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              <Clock className="w-3.5 h-3.5 text-[hsl(var(--seasonal-primary))]" />
              <span>{post.meta.readingTime}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-display text-xl lg:text-2xl mb-3 leading-tight group-hover:text-[hsl(var(--seasonal-primary))] transition-colors line-clamp-2",
            colorMode === "dark" ? "text-white" : "text-[hsl(var(--foreground))]"
          )}
        >
          {post.meta.title}
        </h3>

        {/* Excerpt */}
        <p
          className={cn(
            "font-serif text-sm mb-4 line-clamp-3 leading-relaxed flex-1",
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          )}
        >
          {post.meta.excerpt}
        </p>

        {/* Read More */}
        <div className="flex items-center gap-2 text-[hsl(var(--seasonal-primary))] font-bold mt-auto pt-4 border-t border-[hsl(var(--border))]">
          Read More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
