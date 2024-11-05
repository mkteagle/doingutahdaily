import { Category } from "@/constants/categories";
import { processEventsWithCategories } from "@/utils/categoryHelpers";
import { google } from "googleapis";

const calendar = google.calendar({
  version: "v3",
  auth: new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar.readonly"]
  ),
});

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  link?: string;
  isAllDay: boolean;
  categories?: Category[];
}

export async function getEventsForMonth(month: number, year: number) {
  try {
    // Create dates in local time (MST/MDT)
    // Set time to start of day for start date and end of day for end date
    const startDate = new Date(year, month, 0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    console.info({ startDate, endDate });

    // Convert to ISO string but maintain the intended local time
    const startISO = formatDateToISO(startDate);
    const endISO = formatDateToISO(endDate);

    console.log("Fetching events for:", {
      month: month + 1, // Display 1-based month for clarity
      year,
      startDate: startISO,
      endDate: endISO,
    });

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startISO,
      timeMax: endISO,
      singleEvents: true,
      orderBy: "startTime",
      timeZone: "America/Denver", // Ensure consistent timezone
    });

    const events: CalendarEvent[] = (response.data.items || []).map((event) => {
      const transformNullToUndefined = <T>(value: T | null): T | undefined =>
        value === null ? undefined : value;

      // Check if it's an all-day event
      const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);

      return {
        id: event.id || crypto.randomUUID(),
        title: event.summary || "Untitled Event",
        description: transformNullToUndefined(event.description),
        start: isAllDay
          ? event.start?.date!
          : event.start?.dateTime || event.start?.date!,
        end: isAllDay
          ? event.end?.date!
          : event.end?.dateTime || event.end?.date!,
        location: transformNullToUndefined(event.location),
        link: transformNullToUndefined(event.htmlLink),
        isAllDay,
      };
    });

    return processEventsWithCategories(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
}

// Helper function to format date to ISO string while preserving local time
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Format as YYYY-MM-DDTHH:mm:ss-07:00 (or -06:00 depending on DST)
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offset / 60))
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  const offsetSign = offset >= 0 ? "+" : "-";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

export async function getEventsForYear(year: number) {
  try {
    const events = [];
    for (let month = 0; month < 12; month++) {
      const monthEvents = await getEventsForMonth(month, year);
      events.push(...monthEvents);
    }
    return events;
  } catch (error) {
    console.error(`Error fetching events for year ${year}:`, error);
    throw error;
  }
}
