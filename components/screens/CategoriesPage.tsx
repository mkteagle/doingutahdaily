"use client";
import { H1, Paragraph } from "@/components/ui/typography";
import { CategoriesWidget } from "@/components/Blog/CategoryWidget";
import type { CategoryStats } from "@/constants/categories";

interface CategoriesPageProps {
  categoryStats: CategoryStats[];
}

export default function CategoriesPage({ categoryStats }: CategoriesPageProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <H1 className="mb-4">Categories</H1>
      <Paragraph className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Explore our content by category to find the perfect activities and
        events for your family. Each category represents a unique way to
        experience Utah with your loved ones.
      </Paragraph>

      <CategoriesWidget categories={categoryStats} />
    </div>
  );
}
