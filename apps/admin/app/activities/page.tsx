import { activityService } from "@dud/db";
import { MapPin, CheckCircle2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  let activities: any[] = [];
  try {
    activities = await activityService.getPublishedActivities({ limit: 200 });
  } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Activities</h1>
          <p className="text-sm text-ink/40 mt-0.5">
            {activities.length} published
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-cream border border-sand rounded-xl p-12 text-center">
          <MapPin size={32} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/30 text-sm mb-1">No activities yet.</p>
          <p className="text-ink/20 text-xs">
            Run <code className="bg-sand px-1.5 py-0.5 rounded text-xs">pnpm db:push && pnpm db:seed</code> to populate initial data.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity: any) => (
            <div
              key={activity.id}
              className="bg-cream border border-sand rounded-xl p-5 hover:border-canyon/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink truncate">
                      {activity.title}
                    </h3>
                    {activity.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber/15 text-amber">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink/50 line-clamp-1 mb-2">
                    {activity.shortDescription || activity.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink/40">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {activity.city}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        activity.costTier === "free"
                          ? "bg-sage/15 text-sage"
                          : "bg-sky/10 text-sky"
                      }`}
                    >
                      {activity.costTier}
                    </span>
                    {activity.ageBands?.length > 0 && (
                      <span>
                        Ages:{" "}
                        {activity.ageBands.map((ab: any) => ab.ageBand).join(", ")}
                      </span>
                    )}
                    {activity.verifications?.length > 0 && (
                      <span className="flex items-center gap-1 text-sage">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {activity.website && (
                  <a
                    href={activity.website}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 ml-4 p-2 rounded-lg text-ink/20 hover:text-canyon hover:bg-sand transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
