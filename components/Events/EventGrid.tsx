"use client";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { H3, Paragraph } from "@/components/ui/typography";
import type { CalendarEvent } from "@/lib/googleCalendar";
import { EventCard } from "./EventCard";

interface EventGridProps {
  events?: CalendarEvent[];
  loading?: boolean;
}

export function EventGrid({ events = [], loading = false }: EventGridProps) {
  const { colorMode } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg h-[400px]",
              colorMode === "dark"
                ? "bg-gray-800/50 animate-pulse"
                : "bg-gray-200 animate-pulse"
            )}
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <H3 className="mb-4">No events found</H3>
        <Paragraph>
          Try adjusting your search criteria or check back later for new events.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={`${event.id}-${event.start}-${index}`} event={event} />
      ))}
    </div>
  );
}
