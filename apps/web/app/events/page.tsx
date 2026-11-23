import EventsPage from "@/components/screens/EventsPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/events",
    title: "Utah Events - Family Activities & Festivals",
    description: "Find upcoming family-friendly events, festivals, and seasonal celebrations across Utah.",
  }),
  keywords: ["Utah events", "family events Utah", "Utah festivals", "things to do Utah", "Utah activities", "weekend events Utah", "family activities Utah"],
};

export default function Page() {
  return <EventsPage />;
}
