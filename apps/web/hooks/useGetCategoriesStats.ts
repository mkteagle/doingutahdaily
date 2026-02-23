"use client";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import type { CategoryStats } from "@/constants/categories";

export function useCategoryStats() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryStats() {
      try {
        const response = await fetch(getApiUrl("/categories"));
        if (!response.ok) throw new Error("Failed to fetch category stats");
        const data = await response.json();
        setCategoryStats(data.categoryStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category stats"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryStats();
  }, []);

  return { categoryStats, loading, error };
}
