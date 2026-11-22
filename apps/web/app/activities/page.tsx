import { ActivitiesPage } from "@/components/screens/ActivitiesPage";
import { activityService } from "@dud/db";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({
  path: "/activities",
  title: "Activities — Find Things to Do by Age, Cost & Region",
  description:
    "Browse family-friendly activities across Utah filtered by age, cost, and location. Every listing verified by someone who actually went there.",
});

export default async function Page({ searchParams }: {
  searchParams: Promise<{ category?: string; cost?: string }>;
}) {
  const [params, listings] = await Promise.all([
    searchParams,
    activityService.getPublishedActivities({ limit: 1000 }),
  ]);

  return (
    <ActivitiesPage
      key={JSON.stringify(params)}
      initialCategory={typeof params.category === "string" ? params.category : undefined}
      initialCost={typeof params.cost === "string" ? params.cost : undefined}
      listings={listings.map((activity) => ({
        id: activity.id,
        title: activity.title,
        city: activity.city,
        description: activity.shortDescription ?? activity.description,
        cost: activity.costTier,
        ageBands: activity.ageBands.map(({ ageBand }) => ageBand),
        categories: activity.categories.map(({ category }) => category),
        website: activity.website?.startsWith("https://") ? activity.website : null,
      }))}
    />
  );
}
