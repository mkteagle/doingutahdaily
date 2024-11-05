"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import type { CategoryStats } from "@/constants/categories";
import type { Category } from "@/types/blog";
import { Body, H2, Paragraph } from "@/components/ui/typography";

interface CategoriesWidgetProps {
  categories: CategoryStats[];
  onCategoryClick?: (category: Category) => void;
  className?: string;
}

export function CategoriesWidget({
  categories,
  className,
}: CategoriesWidgetProps) {
  const { colorMode } = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Sort and slice categories
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  const displayedCategories = expanded
    ? sortedCategories
    : sortedCategories.slice(0, 5);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Updated header with larger font size */}
      <div className="space-y-4">
        <H2 className="text-2xl font-bold">Categories</H2>

        {/* Horizontal Rule */}
        <hr
          className={cn(
            "border-t-2",
            colorMode === "dark" ? "border-gray-700" : "border-gray-300"
          )}
        />
      </div>

      {/* Categories List */}
      <ul className="space-y-3">
        {displayedCategories.map(({ category, count }) => (
          <li key={category} className="flex justify-between items-center">
            <Link
              href={`/blog?categories=${category}`}
              className={cn(
                "text-lg font-semibold flex items-center gap-2 transition-colors duration-200", // Larger text size and flex for alignment
                "focus:outline-none",
                colorMode === "dark"
                  ? "text-gray-300 hover:text-gray-100" // Hover effect for dark mode
                  : "text-gray-700 hover:text-gray-500" // Hover effect for light mode
              )}
            >
              {category}
              {/* Lightly colored dash */}
              <span
                className={cn(
                  "text-lg", // Same size as category
                  colorMode === "dark" ? "text-gray-500" : "text-gray-400"
                )}
              >
                &ndash;
              </span>
              {/* Count */}
              <span
                className={cn(
                  "text-lg font-semibold", // Same size as category
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Expand/Collapse Button */}
      {categories.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-2 text-primary transition-colors hover:text-primary/70 focus:outline-none"
          )}
        >
          {expanded ? (
            <div className="flex items-center gap-1">
              <Paragraph>Show Less</Paragraph>
              <span>
                <ChevronUp
                  className={cn(
                    "w-4 h-4",
                    colorMode === "dark"
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-700 hover:text-gray-500"
                  )}
                />
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Paragraph>Show More</Paragraph>
              <span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4",
                    colorMode === "dark"
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-700 hover:text-gray-500"
                  )}
                />
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
