import { verificationService } from "@dud/db";
import { BadgeCheck, AlertTriangle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  let staleActivities: any[] = [];
  try {
    staleActivities = await verificationService.getStaleActivities(60);
  } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Verification</h1>
          <p className="text-sm text-ink/40 mt-0.5">
            Trust badges and freshness monitoring
          </p>
        </div>
      </div>

      {/* Stale activities */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-ink/40 uppercase tracking-[0.15em] mb-3">
          Needs Re-verification ({staleActivities.length})
        </h2>

        {staleActivities.length === 0 ? (
          <div className="bg-cream border border-sand rounded-xl p-8 text-center">
            <BadgeCheck size={32} className="text-sage mx-auto mb-3" />
            <p className="text-ink/50 text-sm">All activities are fresh.</p>
            <p className="text-ink/30 text-xs mt-1">
              Activities older than 60 days without verification will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {staleActivities.map((activity: any) => {
              const daysSince = Math.floor(
                (Date.now() - new Date(activity.updatedAt).getTime()) / 86400000
              );
              return (
                <div
                  key={activity.id}
                  className="bg-cream border border-amber/20 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className="text-amber" />
                        <h3 className="font-semibold text-ink">
                          {activity.title}
                        </h3>
                      </div>
                      <p className="text-sm text-ink/50">
                        {activity.city} — last updated {daysSince} days ago
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber/15 text-amber">
                      Stale
                    </span>
                  </div>
                  {activity.verifications?.[0] && (
                    <div className="mt-2 text-xs text-ink/30 flex items-center gap-1">
                      <Clock size={11} />
                      Last verified:{" "}
                      {new Date(activity.verifications[0].verifiedAt).toLocaleDateString()}
                      {" by "}
                      {activity.verifications[0].verifiedBy}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
