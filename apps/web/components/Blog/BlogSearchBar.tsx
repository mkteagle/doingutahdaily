"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";

export function BlogSearchBar() {
  const { colorMode } = useTheme();
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <Input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={cn(
          "w-full px-4 py-2 rounded-md border",
          colorMode === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-100 border-gray-300 text-gray-900"
        )}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </form>
  );
}
