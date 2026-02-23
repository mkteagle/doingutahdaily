import EventsPage from "@/components/screens/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utah Events - Family Activities & Festivals",
  description:
    "Discover family-friendly activities, festivals, and events happening across Utah. From weekend adventures to seasonal celebrations, find the perfect outing for your family.",
  keywords: ["Utah events", "family events Utah", "Utah festivals", "things to do Utah", "Utah activities", "weekend events Utah", "family activities Utah"],
  openGraph: {
    title: "Utah Events - Family Activities & Festivals",
    description: "Discover family-friendly activities, festivals, and events happening across Utah.",
    url: "https://doingutahdaily.com/events",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Utah Events - Family Activities & Festivals",
    description: "Discover family-friendly activities, festivals, and events happening across Utah."
  }
};

export default function Page() {
  return <EventsPage />;
}
