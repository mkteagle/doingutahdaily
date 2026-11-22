import { NextRequest, NextResponse } from "next/server";
import { getEventsForYear, type CalendarEvent } from "@/lib/googleCalendar";
import { eventService } from "@dud/db";
import { processEventsWithCategories } from "@/utils/categoryHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse parameters
    const yearRangeParam = searchParams.get("yearRange");
    const onlyUpcoming = searchParams.get("onlyUpcoming") === "true";
    const maxEvents = searchParams.get("maxEvents")
      ? parseInt(searchParams.get("maxEvents")!)
      : undefined;

    // Get year range (default to current year if not provided)
    const currentYear = new Date().getFullYear();
    const requestedYears = yearRangeParam?.split(",").map(Number) ?? [currentYear];
    const yearRange = [...new Set(requestedYears)]
      .filter((year) => Number.isInteger(year) && Math.abs(year - currentYear) <= 3)
      .slice(0, 3);
    if (!yearRange.length) return NextResponse.json({ events: [] });

    let events: CalendarEvent[];
    try {
      events = (await Promise.all(yearRange.map(getEventsForYear))).flat();
    } catch {
      const saved = await eventService.getAllEvents();
      events = processEventsWithCategories(saved.filter((event) =>
        yearRange.includes(Number(event.startTime.toISOString().slice(0, 4)))).map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description ?? undefined,
        location: event.location ?? undefined,
        start: event.startTime.toISOString(),
        end: (event.endTime ?? event.startTime).toISOString(),
        isAllDay: false,
      })));
    }

    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // Filter upcoming events if requested
    if (onlyUpcoming) {
      const now = new Date();
      events = events.filter((event) => new Date(event.start) >= now);
    }

    // Limit number of events if requested
    if (maxEvents) {
      events = events.slice(0, maxEvents);
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error in events API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
