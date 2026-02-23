import AboutPage from "@/components/About/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Celebrating Utah's Family Adventures",
  description:
    "Learn about our journey capturing Utah's magic through family adventures and local experiences. Discover why we're passionate about sharing the best of the Beehive State.",
  keywords: ["about Doing Utah Daily", "Utah family blog", "Utah event guide", "about us"],
  openGraph: {
    title: "About Us - Celebrating Utah's Family Adventures",
    description: "Learn about our journey capturing Utah's magic through family adventures and local experiences.",
    url: "https://doingutahdaily.com/about",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Celebrating Utah's Family Adventures",
    description: "Learn about our journey capturing Utah's magic through family adventures."
  }
};

export default function Page() {
  return <AboutPage />;
}
