import { PrivacyPage } from "@/components/screens/PrivacyPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/privacy",
    title: "Privacy Policy - How We Protect Your Information",
    description: "Learn about how Doing Utah Daily collects, uses, and protects your personal information. We are committed to transparency and your privacy.",
  }),
  robots: {
    index: true,
    follow: true
  }
};

export default function Privacy() {
  return <PrivacyPage />;
}
