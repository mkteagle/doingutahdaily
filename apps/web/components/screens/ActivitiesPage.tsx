"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  CheckCircle2,
  Baby,
  TreePine,
  GraduationCap,
  DollarSign,
  ChevronRight,
  X,
} from "lucide-react";

const AGE_BANDS = [
  { value: "0-2", label: "0–2", short: "Baby" },
  { value: "3-5", label: "3–5", short: "Toddler" },
  { value: "6-8", label: "6–8", short: "Kid" },
  { value: "9-11", label: "9–11", short: "Tween" },
  { value: "12-14", label: "12–14", short: "Young Teen" },
  { value: "15-17", label: "15–17", short: "Teen" },
  { value: "all_ages", label: "All Ages", short: "All" },
];

const COST_TIERS = [
  { value: "free", label: "Free", icon: "🆓" },
  { value: "budget", label: "Budget", icon: "$" },
  { value: "moderate", label: "Moderate", icon: "$$" },
  { value: "premium", label: "Premium", icon: "$$$" },
];

const CATEGORIES = [
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Arts & Culture",
  "Food & Dining",
  "Sports & Rec",
  "Educational",
  "Holiday Events",
];

export function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedCost, setSelectedCost] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const activeFilterCount =
    selectedAges.length + selectedCost.length + selectedCategories.length;

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="bg-cream border-b border-border/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-canyon mb-2">
            Activities
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3">
            Find your next adventure
          </h1>
          <p className="font-serif italic text-muted-foreground text-lg max-w-xl">
            Everything&apos;s verified by someone who actually went there. Filter
            by your kids&apos; ages and find exactly what fits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search activities, trails, parks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-canyon/40 transition-colors"
            />
          </div>
        </div>

        {/* Age band filters */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Age Range
          </div>
          <div className="flex flex-wrap gap-2">
            {AGE_BANDS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  toggleFilter(value, selectedAges, setSelectedAges)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedAges.includes(value)
                    ? "bg-canyon text-white border-canyon"
                    : "bg-cream border-border/60 text-foreground hover:border-canyon/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cost tier filters */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Cost
          </div>
          <div className="flex flex-wrap gap-2">
            {COST_TIERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  toggleFilter(value, selectedCost, setSelectedCost)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedCost.includes(value)
                    ? "bg-sage text-white border-sage"
                    : "bg-cream border-border/60 text-foreground hover:border-sage/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Category
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  toggleFilter(cat, selectedCategories, setSelectedCategories)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-sky text-white border-sky"
                    : "bg-cream border-border/60 text-foreground hover:border-sky/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
            <span className="text-sm text-muted-foreground">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              active
            </span>
            <button
              onClick={() => {
                setSelectedAges([]);
                setSelectedCost([]);
                setSelectedCategories([]);
              }}
              className="text-sm font-medium text-canyon hover:text-canyon-deep transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Empty state — activities will be populated from the database */}
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-canyon/10 flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} className="text-canyon" />
          </div>
          <h2 className="font-display text-2xl text-ink mb-2">
            Activities coming soon
          </h2>
          <p className="font-serif italic text-muted-foreground max-w-md mx-auto mb-6">
            We&apos;re building the most honest, verified database of
            family-friendly things to do in Utah. Every listing visited by a
            real person.
          </p>
          <p className="text-sm text-muted-foreground">
            Want to be first to know?{" "}
            <a href="#newsletter" className="text-canyon font-semibold hover:underline">
              Join the newsletter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
