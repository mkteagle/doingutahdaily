"use client";
import {
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/Blog/CategoryBadge";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/googleCalendar";
import { getGoogleCalendarAddUrl } from "@/utils/categoryHelpers";
import { OptimizedImage } from "../OptimizedImage";

interface EventCardProps {
  event: CalendarEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { colorMode } = useTheme();
  const date = new Date(event.start);

  return (
    <div
      className={cn(
        "group rounded-lg overflow-hidden border transition-all h-full",
        colorMode === "dark"
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white border-gray-200"
      )}
    >
      {/* Optimized Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={""} // Use event image or fallback
          alt={event.title}
          slug={`event-${event.id}`}
          category={event.categories?.[0] || "Family Activities"} // Pass the first category or 'general'
          fill
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col h-[calc(100%-9rem)]">
        {/* Categories */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((category) => (
              <CategoryBadge
                key={category}
                category={category}
                size="sm"
                isDarkBackground={colorMode === "dark"}
              />
            ))}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span
            className={cn(
              "text-sm",
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-xl font-semibold mb-2",
            colorMode === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span
              className={cn(
                "text-sm",
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {event.location}
            </span>
          </div>
        )}

        {/* Time */}
        {!event.isAllDay && (
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span
              className={cn(
                "text-sm",
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p
            className={cn(
              "text-sm mb-4 line-clamp-2",
              colorMode === "dark" ? "text-gray-400" : "text-gray-600"
            )}
          >
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4">
          {event.link && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-1"
            >
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                View Details
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-1"
          >
            <a
              href={getGoogleCalendarAddUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Add to Calendar
              <PlusCircle className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
