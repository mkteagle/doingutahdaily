// components/Events/EventsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import type { Category } from "@/constants/categories";
import { EventsError } from "../Events/EventError";
import { EventsSearch } from "../Events/EventsSearch";
import { EventsList } from "../Events/EventsList";
import { PastEvents } from "../Events/PastEvents";
import { useTheme } from "@/theme/theme";
import { Calendar, Sparkles, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { colorMode } = useTheme();
  const currentYear = new Date().getFullYear();
  const { events, loading, error } = useCalendarEvents({
    yearRange: [currentYear - 1, currentYear],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date();
    const filtered = events.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        );

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          event.categories?.includes(category)
        );

      return matchesSearch && matchesCategories;
    });

    return {
      upcomingEvents: filtered.filter(
        (event) => new Date(event.start) >= today
      ),
      pastEvents: filtered.filter((event) => new Date(event.start) < today),
    };
  }, [events, searchQuery, selectedCategories]);

  if (error) {
    return <EventsError error={error} />;
  }

  return (
    <>
      {/* Hero Section - Dramatic Seasonal */}
      <section className="relative overflow-hidden seasonal-gradient min-h-[75vh] flex items-center grain">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[hsl(var(--seasonal-secondary))] opacity-20 blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--seasonal-accent))] opacity-20 blur-3xl top-1/3 right-0 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--seasonal-primary))] opacity-30 blur-3xl bottom-0 left-1/3 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-white/20 rotate-12 animate-rotate-slow"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse-glow"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white/15 rounded-full"></div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-10"></div>

        <div className="relative container mx-auto px-6 lg:px-12 py-20 z-10">
          <div className="max-w-4xl">
            {/* Eyebrow text */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-slide-up">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                UTAH EVENTS & ACTIVITIES
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-6xl lg:text-8xl text-white mb-6 leading-[0.95] animate-slide-up delay-100">
              <span className="block text-balance">Discover</span>
              <span className="block font-serif italic text-white/90 text-5xl lg:text-7xl mt-2">
                What's Happening
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-serif text-2xl lg:text-3xl text-white/95 mb-12 max-w-2xl leading-relaxed animate-slide-up delay-200">
              From weekend adventures to seasonal celebrations, find family-friendly
              events happening all across Utah.
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-6 animate-slide-up delay-300">
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 text-white/90">
                  <Sparkles className="w-5 h-5" />
                  <div>
                    <div className="text-3xl font-display text-white">{upcomingEvents.length}</div>
                    <div className="text-sm font-medium">Upcoming Events</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 text-white/90">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <div className="text-3xl font-display text-white">Daily</div>
                    <div className="text-sm font-medium">Updated</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 text-white/90">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="text-3xl font-display text-white">Free</div>
                    <div className="text-sm font-medium">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={colorMode === 'dark' ? 'hsl(15, 25%, 12%)' : 'hsl(45, 35%, 97%)'}
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Search Section */}
        <div className="mb-16">
          <div
            className={cn(
              "p-8 rounded-3xl border-2",
              colorMode === "dark"
                ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30"
                : "bg-white border-[hsl(var(--seasonal-primary))]/20"
            )}
          >
            <EventsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-20">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-[hsl(var(--seasonal-primary))]"></div>
              <span className="text-[hsl(var(--seasonal-primary))] font-bold text-sm tracking-widest uppercase">
                Coming Soon
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-[hsl(var(--foreground))]">
              Upcoming
              <span className="block font-serif italic text-[hsl(var(--seasonal-primary))]">
                Adventures
              </span>
            </h2>
          </div>

          <EventsList
            title=""
            events={upcomingEvents}
            loading={loading}
          />
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-[hsl(var(--muted-foreground))]"></div>
                <span className="text-[hsl(var(--muted-foreground))] font-bold text-sm tracking-widest uppercase">
                  Archive
                </span>
              </div>
              <h2 className="font-display text-4xl lg:text-5xl text-[hsl(var(--foreground))]">
                Past
                <span className="block font-serif italic text-[hsl(var(--muted-foreground))]">
                  Events
                </span>
              </h2>
            </div>

            <PastEvents events={pastEvents} loading={loading} />
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] grain">
        <div className="absolute inset-0 dot-pattern opacity-10"></div>
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative container mx-auto px-6 lg:px-12 text-center">
          <Calendar className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="font-display text-4xl lg:text-5xl text-white mb-6">
            Never Miss
            <span className="block font-serif italic mt-2">An Event</span>
          </h2>
          <p className="font-serif text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Get weekly event highlights and exclusive updates delivered straight to your inbox.
          </p>
          <button className="px-8 py-4 bg-white text-[hsl(var(--seasonal-primary))] font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover-lift">
            Subscribe to Updates
          </button>
        </div>
      </section>
    </>
  );
}
