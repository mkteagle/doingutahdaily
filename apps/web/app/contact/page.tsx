import { ContactPage } from "@/components/screens/ContactPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/contact",
    title: "Partner With Us - Collaborate with Utah's Premier Event Platform",
    description: "Join forces with Utah's premier family event platform. Showcase your venue, event, or experience to 50,000+ engaged families actively seeking local adventures.",
  }),
  keywords: ["Utah partnerships", "event partnerships Utah", "Utah marketing", "Utah event promotion", "collaborate Utah", "Utah venue promotion"],
};

export default function Page() {
  return <ContactPage />;
}
