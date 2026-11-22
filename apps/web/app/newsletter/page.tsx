import { NewsletterPage } from "@/components/screens/NewsletterPage";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({
  path: "/newsletter",
  title: "This Weekend in Utah — Free Thursday Newsletter",
  description:
    "Every Thursday morning: the best family-friendly events and activities happening this weekend in Utah. Free, honest, no spam.",
});

export default function Page() {
  return <NewsletterPage />;
}
