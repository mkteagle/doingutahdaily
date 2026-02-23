"use client";
import { useTheme } from "@/theme/theme";
import { H1, Paragraph } from "@/components/ui/typography";

export function EventsHero() {
  const { colors } = useTheme();

  return (
    <section className="relative bg-cover bg-center h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Upcoming Events
          <span className="block mt-2" style={{ color: colors.primary }}>
            For Utah Families
          </span>
        </H1>
        <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl">
          Discover family-friendly activities, festivals, and events happening
          across Utah. From seasonal celebrations to educational workshops, find
          the perfect outing for your family.
        </Paragraph>
      </div>
    </section>
  );
}
