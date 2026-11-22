import AboutPage from "@/components/About/AboutPage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/about",
    title: "About Us - Celebrating Utah's Family Adventures",
    description: "Learn about our journey capturing Utah's magic through family adventures and local experiences. Discover why we're passionate about sharing the best of the Beehive State.",
  }),
  keywords: ["about Doing Utah Daily", "Utah family blog", "Utah event guide", "about us"],
};

export default function Page() {
  return <AboutPage />;
}
