"use client";

import { useState, useMemo } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import type { CalendarEvent } from "@/lib/googleCalendar";
import type { Category } from "@/constants/categories";
import { format, parseISO, isPast } from "date-fns";
import {
  Search,
  MapPin,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Category filters ─────────────────────────────────────────────────────────

const FILTER_CATEGORIES: Category[] = [
  "Family Activities",
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Holiday Events",
  "Food & Dining",
  "Arts & Culture",
];

// ─── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event, past }: { event: CalendarEvent; past?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  let day = "–", month = "–", fullDate = "", time = "";
  try {
    const d = parseISO(event.start);
    day = format(d, "d");
    month = format(d, "MMM");
    fullDate = format(d, "EEEE, MMMM d, yyyy");
    time = event.isAllDay ? "All day" : format(d, "h:mm a");
  } catch { /* noop */ }

  const googleCalUrl = event.start
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/[-:]/g, "").split(".")[0]}/${event.end?.replace(/[-:]/g, "").split(".")[0]}`
    : null;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200",
        past ? "opacity-70" : "hover:border-primary/30 hover:shadow-card"
      )}
    >
      <div className="flex gap-4 p-5">
        {/* Date badge */}
        <div
          className={cn(
            "shrink-0 w-14 flex flex-col items-center justify-center rounded-xl py-2 text-center",
            past ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}
        >
          <span className="font-display text-xl leading-none">{day}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{month}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-sm leading-snug text-foreground line-clamp-2">
              {event.title}
            </h3>
            {event.description && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="shrink-0" />
              {fullDate}
              {time && ` · ${time}`}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate max-w-[180px]">{event.location}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {event.categories?.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent"
              >
                {cat}
              </span>
            ))}
            {googleCalUrl && (
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Add to calendar <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>

      {expanded && event.description && (
        <div className="px-5 pb-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed font-serif pt-4 whitespace-pre-line line-clamp-6">
            {event.description.replace(/<[^>]+>/g, "")}
          </p>
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline"
            >
              More info <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex gap-4">
      <div className="w-14 h-14 rounded-xl bg-muted animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const currentYear = new Date().getFullYear();
  const { events, loading, error } = useCalendarEvents({
    yearRange: [currentYear - 1, currentYear],
  });

  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const { upcoming, past } = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = events.filter((e) => {
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description?.toLowerCase() || "").includes(q);
      const matchesCat =
        activeCategories.length === 0 ||
        activeCategories.some((c) => e.categories?.includes(c));
      return matchesSearch && matchesCat;
    });

    return {
      upcoming: filtered.filter((e) => !isPast(parseISO(e.start))),
      past: filtered.filter((e) => isPast(parseISO(e.start))),
    };
  }, [events, search, activeCategories]);

  const displayed = tab === "upcoming" ? upcoming : past;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-background border-b border-border">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Discover
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-4">
            Utah Events
          </h1>
          <p className="font-serif text-lg text-muted-foreground max-w-xl">
            Family-friendly events, festivals, and activities happening across the
            Beehive State.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((cat) => (
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
                onClick={() => setActiveCategories([])}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs + list */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Tab row */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-muted rounded-xl w-fit">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 capitalize",
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
              <span className="ml-2 text-xs opacity-60">
                ({t === "upcoming" ? upcoming.length : past.length})
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive mb-6">
            Failed to load events. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : displayed.length > 0
            ? displayed.map((event) => (
                <EventCard key={event.id} event={event} past={tab === "past"} />
              ))
            : (
              <div className="lg:col-span-2 py-20 text-center">
                <Calendar size={40} className="mx-auto mb-4 text-muted-foreground/40" />
                <p className="font-display text-xl text-foreground mb-2">No events found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
