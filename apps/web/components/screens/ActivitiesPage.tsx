"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";

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

interface Listing {
  id: string;
  title: string;
  city: string;
  description: string | null;
  cost: string;
  ageBands: string[];
  categories: string[];
  website: string | null;
}

export function ActivitiesPage({ listings, initialCategory, initialCost }: {
  listings: Listing[];
  initialCategory?: string;
  initialCost?: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedCost, setSelectedCost] = useState<string[]>(initialCost && COST_TIERS.some(({ value }) => value === initialCost) ? [initialCost] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory && CATEGORIES.includes(initialCategory) ? [initialCategory] : []);

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

  const query = search.trim().toLowerCase();
  const results = listings.filter((activity) =>
    (!query || [activity.title, activity.city, activity.description].some((field) => field?.toLowerCase().includes(query))) &&
    (!selectedAges.length || activity.ageBands.includes("all_ages") || selectedAges.some((age) => activity.ageBands.includes(age))) &&
    (!selectedCost.length || selectedCost.includes(activity.cost)) &&
    (!selectedCategories.length || selectedCategories.some((category) => activity.categories.includes(category)))
  );

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
            Browse Utah outings by age, cost, and the kind of day you have in mind.
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
              type="search"
              aria-label="Search activities"
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
                aria-pressed={selectedAges.includes(value)}
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
                aria-pressed={selectedCost.includes(value)}
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
                aria-pressed={selectedCategories.includes(cat)}
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

        {results.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((activity) => (
              <li key={activity.id} className="rounded-xl border border-border bg-card p-5">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14} aria-hidden />{activity.city}</p>
                <h2 className="mt-2 font-display text-3xl">{activity.title}</h2>
                {activity.description && <p className="mt-2 leading-relaxed">{activity.description}</p>}
                {activity.website && <a className="field-action-link mt-4" href={activity.website}>Visit activity website</a>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-14 text-center">
            <h2 className="font-display text-4xl">{listings.length ? "No activities match those filters" : "Activities are coming soon"}</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">In the meantime, find ideas in our family guides.</p>
            <Link href="/blog" className="field-action-link mt-4">Browse stories &amp; guides</Link>
          </div>
        )}
      </div>
    </div>
  );
}
