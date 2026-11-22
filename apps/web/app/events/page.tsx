import EventsPage from "@/components/screens/EventsPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/events",
    title: "Utah Events - Family Activities & Festivals",
    description: "Discover family-friendly activities, festivals, and events happening across Utah. From weekend adventures to seasonal celebrations, find the perfect outing for your family.",
  }),
  keywords: ["Utah events", "family events Utah", "Utah festivals", "things to do Utah", "Utah activities", "weekend events Utah", "family activities Utah"],
};

export default function Page() {
  return <EventsPage />;
}
