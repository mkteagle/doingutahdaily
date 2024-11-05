"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/googleCalendar";
import { EventCarouselCard } from "./EventCarouselCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface EventCarouselProps {
  events: CalendarEvent[];
  loading?: boolean;
  error?: string | null;
}

export function EventCarousel({ events, loading, error }: EventCarouselProps) {
  const { colors, colorMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Change items per slide based on screen size
  const itemsPerSlide = isMobile ? 1 : 3;

  const slides = Array.from(
    { length: Math.ceil(events.length / itemsPerSlide) },
    (_, i) => events.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide)
  );

  const NavigationArrow = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center", // Smaller on mobile
        "rounded-full transition-all duration-200",
        "backdrop-blur-sm",
        colorMode === "dark"
          ? [
              "bg-gray-800/80 hover:bg-gray-700/80",
              "border border-gray-700",
              disabled && "bg-gray-800/40 cursor-not-allowed",
            ]
          : [
              "bg-white/80 hover:bg-gray-50/80",
              "border border-gray-200",
              disabled && "bg-white/40 cursor-not-allowed",
            ],
        // Adjust positioning for mobile
        direction === "left"
          ? "left-2 md:left-[-3rem]"
          : "right-2 md:right-[-3rem]"
      )}
      style={{
        color: disabled
          ? colorMode === "dark"
            ? "#4A5568"
            : "#A0AEC0"
          : colors.primary,
      }}
      aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(isMobile ? 1 : 3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "p-6 rounded-xl h-64",
              colorMode === "dark" ? "bg-gray-800/50" : "bg-white/50",
              "animate-pulse"
            )}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "text-center py-8",
          colorMode === "dark" ? "text-red-400" : "text-red-500"
        )}
      >
        Unable to load events. Please try again later.
      </div>
    );
  }

  return (
    <div className="relative px-4 md:px-20">
      {slides.length > 1 && (
        <>
          <NavigationArrow
            direction="left"
            onClick={() =>
              setCurrentSlide(
                (current) => (current - 1 + slides.length) % slides.length
              )
            }
            disabled={currentSlide === 0}
          />
          <NavigationArrow
            direction="right"
            onClick={() =>
              setCurrentSlide((current) => (current + 1) % slides.length)
            }
            disabled={currentSlide === slides.length - 1}
          />
        </>
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideEvents, slideIndex) => (
            <div
              key={slideIndex}
              className={cn(
                "w-full flex-shrink-0",
                // Adjust grid based on screen size
                isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-3 gap-6"
              )}
              style={{ minWidth: "100%" }}
            >
              {slideEvents.map((event) => (
                <div key={event.id}>
                  <EventCarouselCard event={event} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "transition-all duration-200 rounded-full",
                index === currentSlide
                  ? [
                      "w-3 h-3",
                      colorMode === "dark" ? "bg-white" : "bg-gray-900",
                    ]
                  : [
                      "w-2 h-2",
                      colorMode === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400",
                    ]
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
