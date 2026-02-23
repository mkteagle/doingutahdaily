"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Blog } from "@/types/blog";
import type { Category } from "@/types/blog";
import { format, parseISO } from "date-fns";
import { Search, X, BookOpen, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogListProps {
  initialPosts: Blog[];
}

const CATEGORIES: Category[] = [
  "Family Activities",
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Holiday Events",
  "Food & Dining",
  "Arts & Culture",
];

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({ post, featured = false }: { post: Blog; featured?: boolean }) {
  const { meta } = post;

  if (featured) {
    return (
      <Link
        href={`/blog/${meta.slug}`}
        className="group col-span-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200"
      >
        {meta.coverImage && (
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.coverImage}
              alt={meta.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-8 flex flex-col justify-center">
          <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">
            Featured
          </span>
          {meta.categories && meta.categories.length > 0 && (
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {meta.categories[0]}
            </span>
          )}
          <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
            {meta.title}
          </h2>
          <p className="font-serif text-base text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
            {meta.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {meta.author?.name && <span>{meta.author.name}</span>}
              <span>·</span>
              <time>{format(parseISO(meta.date), "MMM d, yyyy")}</time>
              {meta.readingTime && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {meta.readingTime}
                  </span>
                </>
              )}
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Read <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${meta.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200"
    >
      {meta.coverImage && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        {meta.categories && meta.categories.length > 0 && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {meta.categories[0]}
          </span>
        )}
        <h3 className="font-display text-base leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors flex-1">
          {meta.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 font-serif mb-4">
          {meta.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <time className="text-xs text-muted-foreground">
            {format(parseISO(meta.date), "MMM d, yyyy")}
          </time>
          <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
            Read <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BlogList({ initialPosts }: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [activeCategories, setActiveCategories] = useState<Category[]>(
    (searchParams?.get("categories")?.split(",").filter(Boolean) as Category[]) || []
  );

  const updateUrl = (s: string, cats: Category[]) => {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (cats.length) params.set("categories", cats.join(","));
    router.push(params.toString() ? `?${params.toString()}` : "/blog", { scroll: false });
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    updateUrl(v, activeCategories);
  };

  const toggleCategory = (cat: Category) => {
    const next = activeCategories.includes(cat)
      ? activeCategories.filter((c) => c !== cat)
      : [...activeCategories, cat];
    setActiveCategories(next);
    updateUrl(search, next);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialPosts.filter(({ meta }) => {
      const matchesSearch =
        !q ||
        meta.title.toLowerCase().includes(q) ||
        meta.excerpt?.toLowerCase().includes(q) ||
        meta.categories?.some((c) => c.toLowerCase().includes(q));
      const matchesCat =
        activeCategories.length === 0 ||
        activeCategories.some((c) => meta.categories?.includes(c));
      return matchesSearch && matchesCat;
    });
  }, [initialPosts, search, activeCategories]);

  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
                Stories &amp; guides
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-4">
                The Blog
              </h1>
              <p className="font-serif text-lg text-muted-foreground max-w-lg">
                Reviews, guides, and adventures from across the Beehive State.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 mt-auto shrink-0">
              <BookOpen size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {initialPosts.length} articles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="relative mb-3">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
                  activeCategories.includes(cat)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
            {activeCategories.length > 0 && (
              <button
                onClick={() => { setActiveCategories([]); updateUrl(search, []); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen size={40} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="font-display text-xl text-foreground mb-2">No articles found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured && <BlogCard post={featured} featured />}
            {rest.map((post) => (
              <BlogCard key={post.meta.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
