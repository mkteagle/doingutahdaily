import { subscriberService } from "@dud/db";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  let subscribers: any[] = [];
  let total = 0;
  try {
    subscribers = await subscriberService.getActiveSubscribers({ limit: 200 });
    total = await subscriberService.getSubscriberCount();
  } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Subscribers</h1>
          <p className="text-sm text-ink/40 mt-0.5">
            {total} active subscriber{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-cream border border-sand rounded-xl p-12 text-center">
          <Users size={32} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/30 text-sm">No subscribers yet.</p>
          <p className="text-ink/20 text-xs mt-1">
            Newsletter signups come from the homepage and{" "}
            <code className="bg-sand px-1.5 py-0.5 rounded">/newsletter</code>
          </p>
        </div>
      ) : (
        <div className="bg-cream border border-sand rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand">
                <th className="text-left text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em] px-5 py-3">
                  Email
                </th>
                <th className="text-left text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em] px-5 py-3">
                  Name
                </th>
                <th className="text-left text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em] px-5 py-3">
                  Regions
                </th>
                <th className="text-left text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em] px-5 py-3">
                  Ages
                </th>
                <th className="text-left text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em] px-5 py-3">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {subscribers.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-sand/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm text-ink font-medium">
                      {sub.email}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-ink/50">
                      {sub.name || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-ink/40">
                      {sub.regions?.length
                        ? sub.regions.join(", ")
                        : "All"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-ink/40">
                      {sub.ageBands?.length
                        ? sub.ageBands.join(", ")
                        : "All"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-ink/30">
                      {formatDate(sub.subscribedAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
