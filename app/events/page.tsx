import EventsPage from "@/components/screens/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Doing Utah Daily",
  description:
    "Discover family-friendly activities, festivals, and events happening across Utah. Find the perfect outing for your family.",
};

export default function Page() {
  return <EventsPage />;
}
