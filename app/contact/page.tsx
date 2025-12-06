import { ContactPage } from "@/components/screens/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us - Collaborate with Utah's Premier Event Platform",
  description:
    "Join forces with Utah's premier family event platform. Showcase your venue, event, or experience to 50,000+ engaged families actively seeking local adventures.",
  keywords: ["Utah partnerships", "event partnerships Utah", "Utah marketing", "Utah event promotion", "collaborate Utah", "Utah venue promotion"],
  openGraph: {
    title: "Partner With Us - Collaborate with Utah's Premier Event Platform",
    description: "Showcase your venue, event, or experience to 50,000+ engaged Utah families.",
    url: "https://doingutahdaily.com/contact",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner With Us - Collaborate with Utah's Premier Event Platform",
    description: "Showcase your venue, event, or experience to 50,000+ engaged Utah families."
  }
};

export default function Page() {
  return <ContactPage />;
}
