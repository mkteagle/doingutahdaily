import {
  CATEGORIES,
  Category,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_KEYWORDS,
  type CategoryStats,
} from "@/constants/categories";
import { CalendarEvent } from "@/lib/googleCalendar";

export async function getCategoryStats(
  posts: any[] = []
): Promise<CategoryStats[]> {
  // Initialize counts for all categories
  const categoryCounts: Record<string, number> = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0])
  );

  // Count posts per category
  posts.forEach((post) => {
    post.meta.categories?.forEach((category: Category) => {
      if (category in categoryCounts) {
        categoryCounts[category]++;
      }
    });
  });

  // Format data for the widget, including categories with 0 posts
  return CATEGORIES.map((category) => ({
    category,
    count: categoryCounts[category],
    description: CATEGORY_DESCRIPTIONS[category],
  }));
}

export async function getPopularCategories(
  posts: any[] = [],
  limit: number = 5
): Promise<CategoryStats[]> {
  const stats = await getCategoryStats(posts);
  return stats.sort((a, b) => b.count - a.count).slice(0, limit);
}
/**
 * Assigns categories to events based on keyword matching in title and description
 */
export function assignCategoriesToEvent(event: CalendarEvent): CalendarEvent {
  const categoriesToCheck = Object.entries(CATEGORY_KEYWORDS);
  const matchedCategories = new Set<Category>();

  // Combine title and description for keyword searching
  const searchText = `${event.title} ${event.description || ""}`.toLowerCase();

  // Check each category's keywords against the event text
  categoriesToCheck.forEach(([category, keywords]) => {
    const hasMatch = keywords.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );

    if (hasMatch) {
      matchedCategories.add(category as Category);
    }
  });

  // Add seasonal categories based on date
  const eventDate = new Date(event.start);
  const month = eventDate.getMonth();

  // Add season based on month
  if (month >= 2 && month <= 4) matchedCategories.add("Spring");
  else if (month >= 5 && month <= 7) matchedCategories.add("Summer");
  else if (month >= 8 && month <= 10) matchedCategories.add("Fall");
  else matchedCategories.add("Winter");

  // Add holiday categories based on specific date patterns
  const dateString = eventDate
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })
    .toLowerCase();

  // Check for major holidays
  if (month === 11 && dateString.includes("december 25")) {
    matchedCategories.add("Christmas");
  } else if (month === 10 && dateString.includes("october 31")) {
    matchedCategories.add("Holiday Events");
  } else if (month === 6 && dateString.includes("july 4")) {
    matchedCategories.add("Fourth of July");
  }

  // If no specific categories matched, add "Family Activities" as default
  if (matchedCategories.size === 1) {
    // Only has season
    matchedCategories.add("Family Activities");
  }

  return {
    ...event,
    categories: Array.from(matchedCategories),
  };
}

/**
 * Process a list of events to assign categories
 */
export function processEventsWithCategories(
  events: CalendarEvent[]
): CalendarEvent[] {
  return events.map((event) => assignCategoriesToEvent(event));
}

/**
 * Filter events by category
 */
export function filterEventsByCategory(
  events: CalendarEvent[],
  category: Category
): CalendarEvent[] {
  return events.filter((event) => event.categories?.includes(category));
}

/**
 * Get all unique categories from a list of events
 */
export function getUniqueEventCategories(events: CalendarEvent[]): Category[] {
  const categories = new Set<Category>();
  events.forEach((event) => {
    event.categories?.forEach((category) => categories.add(category));
  });
  return Array.from(categories);
}

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ?? "";

console.info({ CALENDAR_ID });

// Function to encode the calendar ID for use in URLs
function getEncodedCalendarId(): string {
  return encodeURIComponent(CALENDAR_ID);
}

export function getGoogleCalendarUrl(): string {
  const encodedCalendarId = getEncodedCalendarId();
  return `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&ctz=America%2FDenver`;
}

export function getGoogleCalendarAddUrl(event: CalendarEvent): string {
  const encodedCalendarId = getEncodedCalendarId();

  // Format the dates for Google Calendar
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const dates = event.isAllDay
    ? `dates=${startDate.toISOString().split("T")[0]}/${
        endDate.toISOString().split("T")[0]
      }`
    : `dates=${startDate.toISOString().replace(/[:-]/g, "")}/${endDate
        .toISOString()
        .replace(/[:-]/g, "")}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description || "",
    location: event.location || "",
    ctz: "America/Denver",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}&${dates}`;
}

// Helper to group posts by category
export function groupPostsByCategory(posts: any[]) {
  const groupedPosts: Record<Category, any[]> = {} as Record<Category, any[]>;

  CATEGORIES.forEach((category) => {
    groupedPosts[category] = [];
  });

  posts.forEach((post) => {
    post.meta.categories?.forEach((category: Category) => {
      if (category in groupedPosts) {
        groupedPosts[category].push(post);
      }
    });
  });

  return groupedPosts;
}

export async function getCategoryPosts(category: string, posts: any[] = []) {
  return posts.filter((post) =>
    post.meta.categories?.includes(category as Category)
  );
}
