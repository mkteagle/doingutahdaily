import { NewsletterForm } from "@/components/NewsletterForm";

export function NewsletterPage() {
  return (
    <section className="field-container field-section text-center">
      <div className="rounded-2xl bg-card px-5 py-12 sm:py-20">
        <h1 className="font-display text-4xl sm:text-6xl">
          Doing Utah Daily newsletter
        </h1>
        <p className="mx-auto mb-7 mt-4 max-w-lg text-lg text-muted-foreground">
          Join the list for family outing ideas, seasonal guides, and occasional
          weekend roundups when the newsletter launches.
        </p>
        <NewsletterForm variant="light" />
      </div>
    </section>
  );
}
