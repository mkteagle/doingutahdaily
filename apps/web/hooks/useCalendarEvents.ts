// hooks/useCalendarEvents.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { getApiUrl } from "@/lib/api";
import type { CalendarEvent } from "@/lib/googleCalendar";

export interface UseCalendarEventsOptions {
  yearRange?: number[];
  onlyUpcoming?: boolean;
  maxEvents?: number;
}

export function useCalendarEvents({
  yearRange,
  onlyUpcoming = false,
  maxEvents,
}: UseCalendarEventsOptions = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the yearRange string to prevent unnecessary re-fetches
  const yearRangeString = yearRange?.join(",") || "";

  // Memoize the fetch function
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (yearRangeString) params.set("yearRange", yearRangeString);
      if (onlyUpcoming) params.set("onlyUpcoming", "true");
      if (maxEvents) params.set("maxEvents", maxEvents.toString());

      const response = await fetch(`${getApiUrl("/events")}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [yearRangeString, onlyUpcoming, maxEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error };
}
