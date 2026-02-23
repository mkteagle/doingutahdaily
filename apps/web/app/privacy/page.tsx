import { PrivacyPage } from "@/components/screens/PrivacyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Information",
  description: "Learn about how Doing Utah Daily collects, uses, and protects your personal information. We are committed to transparency and your privacy.",
  openGraph: {
    title: "Privacy Policy - Doing Utah Daily",
    description: "Learn about how we protect your personal information and respect your privacy.",
    url: "https://doingutahdaily.com/privacy",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function Privacy() {
  return <PrivacyPage />;
}
