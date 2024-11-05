"use client";
import { H2 } from "@/components/ui/typography";
import { EventCarousel } from "@/components/Home/EventCarousel";
import type { CalendarEvent } from "@/lib/googleCalendar";

interface FeaturedEventsProps {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export function FeaturedEvents({
  events,
  loading,
  error,
}: FeaturedEventsProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <H2 className="mb-8">Featured Upcoming Events</H2>
      <EventCarousel events={events} loading={loading} error={error} />
    </section>
  );
}
