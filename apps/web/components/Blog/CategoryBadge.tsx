"use client";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/blog";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "hero";
  isDarkBackground: boolean;
}

export function CategoryBadge({
  category,
  className,
  size = "md",
  variant = "default",
  isDarkBackground,
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  // Set category-specific colors based on background brightness
  const getCategoryColors = () => {
    const baseColor = "#000000"; // Replace with actual primary color if needed
    const opacity = isDarkBackground ? "30" : "10";

    return {
      bg: `${baseColor}${opacity}`,
      text: isDarkBackground ? "#FFFFFF" : "#000000",
      border: `${baseColor}20`,
    };
  };

  const categoryColors = getCategoryColors();

  const variantClasses = {
    default: cn(
      "border shadow-sm backdrop-blur-sm",
      isDarkBackground ? "hover:bg-white/10" : "hover:bg-black/5"
    ),
    hero: cn(
      "bg-white/10 hover:bg-white/20 text-white border-white/20",
      "backdrop-blur-md"
    ),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        backgroundColor: variant === "default" ? categoryColors.bg : undefined,
        color: variant === "default" ? categoryColors.text : undefined,
        borderColor: variant === "default" ? categoryColors.border : undefined,
      }}
    >
      {category}
    </span>
  );
}
