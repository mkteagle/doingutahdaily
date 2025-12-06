import { TermsPage } from "@/components/screens/TermsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Website Usage Terms",
  description: "Read the terms of service for using Doing Utah Daily. Learn about your rights and responsibilities when using our website and services.",
  openGraph: {
    title: "Terms of Service - Doing Utah Daily",
    description: "Read our terms of service and learn about using our website responsibly.",
    url: "https://doingutahdaily.com/terms",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function Terms() {
  return <TermsPage />;
}
