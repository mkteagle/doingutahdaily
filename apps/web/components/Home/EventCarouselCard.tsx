"use client";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/lib/googleCalendar";
import { useTheme } from "@/theme/theme";
import { Card, CardContent } from "@/components/ui/card";
import { Body, H3, Paragraph } from "@/components/ui/typography";
import { OptimizedImage } from "@/components/OptimizedImage"; // Import OptimizedImage

interface EventCarouselCardProps {
  event: CalendarEvent;
}

export function EventCarouselCard({ event }: EventCarouselCardProps) {
  const { colorMode } = useTheme();

  return (
    <Card
      className={cn(
        "h-full transition-all duration-200 relative",
        "hover:shadow-md",
        colorMode === "dark"
          ? "hover:bg-card/70 border-border"
          : "hover:bg-accent/10 border-border"
      )}
    >
      {/* Optimized Image as Background */}
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
        <OptimizedImage
          src={""} // Empty string if there's no image
          alt={event.title}
          slug={`event-${event.id}`}
          category={event.categories?.[0] || "Family Activities"} // Default to "Family Activities"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/30 z-10" />{" "}
        {/* Overlay for contrast */}
      </div>

      <CardContent className="p-6 flex flex-col z-20">
        {/* Title */}
        <H3
          className={cn(
            "text-xl font-semibold mb-4",
            colorMode === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          {event.title}
        </H3>

        {/* Meta Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar
              className={cn(
                "w-5 h-5",
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            />
            <span
              className={
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              }
            >
              {format(new Date(event.start), "MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "w-5 h-5",
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            />
            <span
              className={
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              }
            >
              {event.isAllDay
                ? "All Day"
                : format(new Date(event.start), "h:mm a")}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin
                className={cn(
                  "w-5 h-5",
                  colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              />
              <span
                className={cn(
                  "line-clamp-1",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                {event.location}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <Paragraph
            className={cn(
              "line-clamp-2 text-sm",
              colorMode === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {event.description}
          </Paragraph>
        )}

        {/* Learn More Link */}
        {event.link && (
          <Body className="pt-4 mt-auto">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-medium inline-flex items-center gap-1",
                "transition-colors duration-200",
                "hover:opacity-80"
              )}
              style={{ color: "var(--primary)" }}
            >
              Learn More
              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </Body>
        )}
      </CardContent>
    </Card>
  );
}
