"use client";
import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import type { CalendarEvent } from "@/lib/googleCalendar";
import { getGoogleCalendarUrl } from "@/utils/categoryHelpers";
import { EventGrid } from "./EventGrid";
import { ViewCalendarLink } from "./ViewCalendarLink";

const PAST_EVENTS_PER_PAGE = 6;

interface PastEventsProps {
  events: CalendarEvent[];
  loading: boolean;
}

export function PastEvents({ events, loading }: PastEventsProps) {
  const [page, setPage] = useState(1);

  const paginatedEvents = events.slice(0, page * PAST_EVENTS_PER_PAGE);
  const hasMore = events.length > page * PAST_EVENTS_PER_PAGE;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const openCalendar = () => {
    window.open(getGoogleCalendarUrl(), "_blank");
  };

  return (
    <div>
      <H2 className="mb-4">Past Events</H2>
      <EventGrid events={paginatedEvents} loading={loading} />

      <div className="flex flex-col items-center gap-4 mt-8">
        {hasMore && (
          <Button onClick={handleLoadMore} variant="outline" className="gap-2">
            Load More <ChevronDown className="w-4 h-4" />
          </Button>
        )}
        <ViewCalendarLink />
      </div>
    </div>
  );
}
