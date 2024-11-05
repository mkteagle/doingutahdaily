// components/Events/EventsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import type { Category } from "@/constants/categories";
import { EventsError } from "../Events/EventError";
import { EventsHero } from "../Events/EventsHero";
import { FeaturedEvents } from "../Events/FeaturedEvents";
import { EventsSearch } from "../Events/EventsSearch";
import { EventsList } from "../Events/EventsList";
import { PastEvents } from "../Events/PastEvents";

export default function EventsPage() {
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
    <div className="min-h-screen">
      <EventsHero />

      <FeaturedEvents
        events={upcomingEvents.slice(0, 6)}
        loading={loading}
        error={error}
      />

      <div className="container mx-auto px-4 py-8">
        <EventsSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />

        <EventsList
          title="All Upcoming Events"
          events={upcomingEvents}
          loading={loading}
        />

        <PastEvents events={pastEvents} loading={loading} />
      </div>
    </div>
  );
}
