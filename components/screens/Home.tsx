"use client";
import { useTheme } from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { PartnershipCTA } from "../Home/PartnershipCTA";
import { EventCarousel } from "../Home/EventCarousel";
import { H2 } from "../ui/typography";
import { HeroButtons } from "../Home/HeroButtons";

export function Home() {
  const { colors, colorMode } = useTheme();
  const { events, loading, error } = useCalendarEvents({ onlyUpcoming: true });

  return (
    <>
      {/* Hero Section - Kept the same */}
      <section className="relative bg-cover bg-center h-[600px]">
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"
          style={{
            backgroundImage: "url('/api/placeholder/1920/600')",
          }}
        ></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1
            className={`text-6xl font-bold mb-6 max-w-2xl ${
              colorMode === "dark" ? "text-white" : "text-gray-900"
            } drop-shadow-lg`}
          >
            Discover Utah&apos;s Magic
            <span className="block mt-2" style={{ color: colors.primary }}>
              Every Single Day
            </span>
          </h1>
          <p
            className={`text-2xl mb-8 max-w-xl ${
              colorMode === "dark" ? "text-white" : "text-gray-800"
            } drop-shadow-md`}
          >
            Your daily guide to family-friendly events, activities, and
            adventures across Utah.
          </p>
          <HeroButtons />
        </div>
      </section>

      {/* Events Section */}
      <section className="container mx-auto px-8 py-16">
        {/* Increased padding */}
        <H2 className="text-3xl font-semibold mb-8 text-center">
          Upcoming Events
        </H2>
        <EventCarousel events={events} loading={loading} error={error} />
      </section>

      {/* Partnership CTA */}
      <PartnershipCTA />
    </>
  );
}
