"use client";
import {
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  ExternalLink,
  Sparkles,
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
        "group relative rounded-2xl overflow-hidden border-2 transition-all h-full hover-lift shadow-lg",
        colorMode === "dark"
          ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))]"
          : "bg-white border-[hsl(var(--primary))]/20 hover:border-[hsl(var(--primary))]"
      )}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-10 -rotate-45 translate-x-12 -translate-y-12 group-hover:opacity-20 transition-opacity"></div>

      {/* Image Container with dramatic overlay */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={""} // Use event image or fallback
          alt={event.title}
          slug={`event-${event.id}`}
          category={event.categories?.[0] || "Family Activities"}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>

        {/* Date badge - positioned on image */}
        <div className="absolute top-4 left-4 bg-white text-[hsl(var(--primary))] rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[hsl(var(--primary))] text-white text-xs font-bold px-3 py-1 text-center">
            {date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
          </div>
          <div className="px-3 py-2 text-center">
            <div className="text-2xl font-display leading-none">
              {date.getDate()}
            </div>
          </div>
        </div>

        {/* Categories - positioned on image */}
        {event.categories && event.categories.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {event.categories.slice(0, 2).map((category) => (
              <CategoryBadge
                key={category}
                category={category}
                size="sm"
                isDarkBackground={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col">
        {/* Title */}
        <h3
          className={cn(
            "font-display text-2xl mb-3 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors",
            colorMode === "dark" ? "text-white" : "text-[hsl(var(--foreground))]"
          )}
        >
          {event.title}
        </h3>

        {/* Meta information */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
              <span
                className={cn(
                  "text-sm font-medium",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                {event.location}
              </span>
            </div>
          )}

          {/* Time */}
          {!event.isAllDay && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
              <span
                className={cn(
                  "text-sm font-medium",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                {date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p
            className={cn(
              "font-serif text-sm mb-6 line-clamp-3 leading-relaxed",
              colorMode === "dark" ? "text-gray-400" : "text-gray-600"
            )}
          >
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-[hsl(var(--border))]">
          {event.link && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] text-white font-bold rounded-xl group/btn"
            >
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                View Event Details
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "font-bold rounded-xl border-2 hover:bg-[hsl(var(--primary))]/10",
              colorMode === "dark"
                ? "border-[hsl(var(--primary))]/50 hover:border-[hsl(var(--primary))]"
                : "border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))]"
            )}
          >
            <a
              href={getGoogleCalendarAddUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add to Calendar
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
