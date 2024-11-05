"use client";
import { Calendar, User, Clock } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/blog";
import { useTheme } from "@/theme/theme";
import { Body } from "../ui/typography";
import { OptimizedImage } from "../OptimizedImage";

interface BlogCardProps {
  post: Blog;
}

export function BlogCard({ post }: BlogCardProps) {
  const { colors, colorMode } = useTheme();

  return (
    <Link
      href={`/blog/${post.meta.slug}`}
      className={cn(
        "group flex flex-col rounded-xl overflow-hidden transition duration-200",
        "border shadow-sm hover:shadow-md",
        colorMode === "dark"
          ? "bg-gray-800/50 hover:bg-gray-800/70 border-gray-700"
          : "bg-white hover:bg-gray-50/80 border-gray-200"
      )}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={post.meta.coverImage || "/images/placeholder.jpg"}
          alt={post.meta.title}
          category={post.meta.categories[0]} // Pass the first category for fallback images
          slug={post.meta.slug}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="flex flex-col p-6">
        {/* Categories */}
        {post.meta.categories && post.meta.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.meta.categories.map((category) => (
              <CategoryBadge
                key={category}
                category={category}
                size="sm"
                isDarkBackground={colorMode === "dark"}
              />
            ))}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
          <div
            className={cn(
              "flex items-center gap-1",
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            <User className="w-4 h-4" />
            <span>{post.meta.author.name}</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1",
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.meta.date).toLocaleDateString()}</span>
          </div>
          {post.meta.readingTime && (
            <div
              className={cn(
                "flex items-center gap-1",
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              <Clock className="w-4 h-4" />
              <span>{post.meta.readingTime}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className={cn(
            "text-xl font-semibold mb-3 transition-colors line-clamp-2",
            "group-hover:text-primary"
          )}
          style={{ color: colors.text }}
        >
          {post.meta.title}
        </h2>

        {/* Excerpt */}
        <p
          className={cn(
            "mb-4 line-clamp-2",
            colorMode === "dark" ? "text-gray-300" : "text-gray-600"
          )}
        >
          {post.meta.excerpt}
        </p>

        {/* Read More */}
        <Body
          className={cn(
            "mt-auto font-medium inline-flex items-center",
            "transition-colors duration-200"
          )}
          style={{ color: colors.primary }}
        >
          Read More
          <span className="transition-transform group-hover:translate-x-1 ml-1">
            →
          </span>
        </Body>
      </div>
    </Link>
  );
}
