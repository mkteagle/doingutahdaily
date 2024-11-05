"use client";
import { useTheme } from "@/theme/theme";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryAutocomplete } from "@/components/Blog/CategoryAutocomplete";
import { CATEGORIES } from "@/constants/categories";
import type { Category } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface EventsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export function EventsSearch({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
}: EventsSearchProps) {
  const { colors, colorMode } = useTheme();

  return (
    <div className="flex flex-col gap-4 max-w-2xl mb-8">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: colors.primary }}
        />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-10",
            colorMode === "dark"
              ? "bg-gray-800/50 text-white"
              : "bg-white text-gray-900"
          )}
        />
      </div>
      <CategoryAutocomplete
        categories={CATEGORIES as any}
        selectedCategories={selectedCategories}
        setSelectedCategories={onCategoriesChange}
      />
    </div>
  );
}
