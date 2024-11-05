"use client";
import { H2, Paragraph } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface EventsErrorProps {
  error: string;
}

export function EventsError({ error }: EventsErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <H2 className="mb-4">Error Loading Events</H2>
      <Paragraph className="text-red-500 mb-8">{error}</Paragraph>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  );
}
