import { SubmitPage } from "@/components/screens/SubmitPage";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({
  path: "/submit",
  title: "Submit an Activity — Share Your Spot with Utah Families",
  description:
    "Own a venue, organize events, or know a hidden gem? Submit it to Doing Utah Daily and help families discover what's great about Utah.",
});

export default function Page() {
  return <SubmitPage />;
}
