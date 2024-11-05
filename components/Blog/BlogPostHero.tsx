"use client";
import {
  Calendar,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./CategoryBadge";
import type { Category } from "@/types/blog";
import { OptimizedImage } from "../OptimizedImage";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { useImageBrightness } from "@/context/ImageBrightnessContext";

interface BlogPostHeroProps {
  title: string;
  date: string;
  slug: string;
  author: {
    name: string;
    picture?: string;
  };
  coverImage?: string;
  categories?: Category[];
  readingTime?: string;
}

interface ShareButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}

function ShareButton({ children, onClick, label }: ShareButtonProps) {
  const { colors } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "text-white hover:text-white",
        "hover:bg-white/20 transition-colors",
        "backdrop-blur-sm"
      )}
      style={
        {
          "--hover-overlay": colors.primary + "20",
        } as React.CSSProperties
      }
      title={label}
    >
      {children}
    </Button>
  );
}

export function BlogPostHero({
  title,
  date,
  author,
  coverImage,
  categories = [],
  readingTime,
  slug,
}: BlogPostHeroProps) {
  const { colors, colorMode } = useTheme();

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async (
    platform: "twitter" | "facebook" | "linkedin" | "copy"
  ) => {
    const url = window.location.href;
    const text = `Check out "${title}"`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(title)}`
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  const { isDarkBackground } = useImageBrightness();

  return (
    <div className="relative h-[70vh] min-h-[600px]">
      {/* Background Image */}
      <OptimizedImage
        src={coverImage || "/placeholder.svg"}
        alt={title}
        priority
        className="absolute inset-0"
        category={categories[0]}
        slug={slug}
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-t",
          colorMode === "dark"
            ? "from-black/95 via-black/70 to-black/30"
            : "from-black/90 via-black/60 to-black/20"
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <CategoryBadge
                    key={category}
                    category={category}
                    variant="hero"
                    isDarkBackground={isDarkBackground}
                  />
                ))}
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl",
                "font-bold text-white leading-tight",
                "transition-colors duration-200"
              )}
            >
              {title}
            </h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 pt-4">
              <span className="text-sm text-white/80 mr-4">Share</span>
              <ShareButton
                onClick={() => handleShare("twitter")}
                label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </ShareButton>
              <ShareButton
                onClick={() => handleShare("facebook")}
                label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </ShareButton>
              <ShareButton
                onClick={() => handleShare("linkedin")}
                label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </ShareButton>
              <ShareButton
                onClick={() => handleShare("copy")}
                label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </ShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
