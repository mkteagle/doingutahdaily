
"use client";
import { H2 } from "@/components/ui/typography";
import type { CalendarEvent } from "@/lib/googleCalendar";
import { EventGrid } from "./EventGrid";

interface EventsListProps {
  title: string;
  events: CalendarEvent[];
  loading: boolean;
}

export function EventsList({ title, events, loading }: EventsListProps) {
  return (
    <div className="mb-16">
      <H2 className="mb-4">{title}</H2>
      <EventGrid events={events} loading={loading} />
    </div>
  );
}
