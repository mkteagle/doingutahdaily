import { NewsletterPage } from "@/components/screens/NewsletterPage";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({
  path: "/newsletter",
  title: "Newsletter Signup",
  description:
    "Join the Doing Utah Daily newsletter list for Utah family outing ideas, seasonal guides, and occasional weekend roundups when it launches.",
});

export default function Page() {
  return <NewsletterPage />;
}
