import { ContactPage } from "@/components/screens/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us | Doing Utah Daily",
  description:
    "Join forces with Utah's premier family event platform. Showcase your venue, event, or experience to our engaged community of adventure-seeking families.",
};

export default function Page() {
  return <ContactPage />;
}
