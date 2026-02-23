import { NextRequest, NextResponse } from "next/server";
import { getEventsForYear } from "@/lib/googleCalendar";

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
    const yearRange = yearRangeParam
      ? yearRangeParam.split(",").map((year) => parseInt(year))
      : [currentYear];

    // Fetch events for the entire range of years
    const eventsPromises = yearRange.map((year) => getEventsForYear(year));
    const eventsArrays = await Promise.all(eventsPromises);

    // Combine and sort events
    let events = eventsArrays
      .flat()
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

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
