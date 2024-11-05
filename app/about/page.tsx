import AboutPage from "@/components/About/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Doing Utah Daily",
  description:
    "Learn about our journey capturing Utah's magic through family adventures and local experiences.",
};

export default function Page() {
  return <AboutPage />;
}
