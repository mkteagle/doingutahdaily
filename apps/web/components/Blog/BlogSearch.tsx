"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { CATEGORIES, Category } from "@/constants/categories"; // Now using constants
import { CategoryAutocomplete } from "./CategoryAutocomplete";

interface BlogSearchProps {
  searchQuery: string;
  selectedCategories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categories: Category[]) => void; // Changed from setSelectedCategories
}

export function BlogSearch({
  searchQuery,
  selectedCategories,
  onCategoryChange,
  onSearchChange,
}: BlogSearchProps) {
  const { colors, colorMode } = useTheme();
  const [categoryQuery, setCategoryQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 max-w-2xl mb-16">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
            "transition-colors duration-200"
          )}
          style={{ color: colors.primary }}
        />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-10",
            colorMode === "dark"
              ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500",
            "focus:border-primary focus:ring-primary/20"
          )}
        />
      </div>
      <CategoryAutocomplete
        categories={[...CATEGORIES]}
        selectedCategories={selectedCategories}
        setSelectedCategories={onCategoryChange}
      />
    </div>
  );
}
