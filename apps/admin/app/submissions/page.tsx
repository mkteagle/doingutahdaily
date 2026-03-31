import { submissionService } from "@dud/db";
import { Inbox, MapPin, Clock, Mail, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber/15 text-amber",
  approved: "bg-sage/15 text-sage",
  rejected: "bg-red-100 text-red-600",
  needs_info: "bg-sky/15 text-sky",
};

export default async function SubmissionsPage() {
  let submissions: any[] = [];
  try {
    submissions = await submissionService.getSubmissions({ limit: 100 });
  } catch {}

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Submissions</h1>
          <p className="text-sm text-ink/40 mt-0.5">
            {pending.length} pending review
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-cream border border-sand rounded-xl p-12 text-center">
          <Inbox size={32} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/30 text-sm">No submissions yet.</p>
          <p className="text-ink/20 text-xs mt-1">
            Venues and community members can submit at{" "}
            <code className="bg-sand px-1.5 py-0.5 rounded">/submit</code>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-ink/40 uppercase tracking-[0.15em] mb-3">
                Pending Review ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((sub: any) => (
                  <SubmissionCard key={sub.id} submission={sub} />
                ))}
              </div>
            </div>
          )}

          {reviewed.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-ink/40 uppercase tracking-[0.15em] mb-3">
                Reviewed ({reviewed.length})
              </h2>
              <div className="space-y-3">
                {reviewed.map((sub: any) => (
                  <SubmissionCard key={sub.id} submission={sub} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission: sub }: { submission: any }) {
  return (
    <div className="bg-cream border border-sand rounded-xl p-5 hover:border-canyon/20 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-ink">{sub.title}</h3>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            STATUS_STYLES[sub.status] ?? "bg-ink/5 text-ink/40"
          }`}
        >
          {sub.status}
        </span>
      </div>
      {sub.description && (
        <p className="text-sm text-ink/50 line-clamp-2 mb-3">
          {sub.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 text-xs text-ink/40">
        <span className="flex items-center gap-1">
          <User size={12} />
          {sub.submitterName}
          {sub.submitterRole && ` (${sub.submitterRole})`}
        </span>
        <span className="flex items-center gap-1">
          <Mail size={12} />
          {sub.submitterEmail}
        </span>
        {sub.city && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {sub.city}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(sub.createdAt)}
        </span>
        {sub.isFree && (
          <span className="px-2 py-0.5 rounded-full bg-sage/15 text-sage font-medium">
            Free
          </span>
        )}
      </div>
      {sub.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {sub.categories.map((cat: string) => (
            <span
              key={cat}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-sand text-ink/40"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
