import { TermsPage } from "@/components/screens/TermsPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/terms",
    title: "Terms of Service - Website Usage Terms",
    description: "Read the terms of service for using Doing Utah Daily. Learn about your rights and responsibilities when using our website and services.",
  }),
  robots: {
    index: true,
    follow: true
  }
};

export default function Terms() {
  return <TermsPage />;
}
