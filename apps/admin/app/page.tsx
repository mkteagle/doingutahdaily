import Link from "next/link";
import { postService, activityService, submissionService, subscriberService } from "@dud/db";
import {
  FileText,
  MapPin,
  Inbox,
  Users,
  Calendar,
  Instagram,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let postCount = 0;
  let activityCount = 0;
  let pendingSubmissions = 0;
  let subscriberCount = 0;

  try {
    const posts = await postService.getAllPosts();
    postCount = posts.length;
  } catch {}
  try {
    const activities = await activityService.getPublishedActivities({ limit: 1000 });
    activityCount = activities.length;
  } catch {}
  try {
    const subs = await submissionService.getSubmissions({ status: "pending", limit: 1000 });
    pendingSubmissions = subs.length;
  } catch {}
  try {
    subscriberCount = await subscriberService.getSubscriberCount();
  } catch {}

  const cards = [
    {
      label: "Posts",
      href: "/posts",
      description: "Write and manage blog posts",
      icon: FileText,
      stat: postCount,
      statLabel: "total",
      color: "text-canyon bg-canyon/10",
    },
    {
      label: "Activities",
      href: "/activities",
      description: "Manage family-friendly listings",
      icon: MapPin,
      stat: activityCount,
      statLabel: "published",
      color: "text-sage bg-sage/10",
    },
    {
      label: "Submissions",
      href: "/submissions",
      description: "Review venue/activity submissions",
      icon: Inbox,
      stat: pendingSubmissions,
      statLabel: "pending",
      color: "text-amber bg-amber/10",
    },
    {
      label: "Subscribers",
      href: "/subscribers",
      description: "Newsletter subscriber list",
      icon: Users,
      stat: subscriberCount,
      statLabel: "active",
      color: "text-sky bg-sky/10",
    },
    {
      label: "Events",
      href: "/events",
      description: "Manage calendar events",
      icon: Calendar,
      stat: null,
      statLabel: null,
      color: "text-slate bg-slate/10",
    },
    {
      label: "Social Feed",
      href: "/social",
      description: "Sync Instagram & TikTok",
      icon: Instagram,
      stat: null,
      statLabel: null,
      color: "text-canyon bg-canyon/10",
    },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-sm text-ink/50 mb-8">
        Doing Utah Daily — content & activity management
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <div className="bg-cream border border-sand rounded-xl p-5 hover:border-canyon/30 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon size={18} />
                  </div>
                  {card.stat !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ink">{card.stat}</div>
                      <div className="text-[10px] font-medium text-ink/40 uppercase tracking-wider">
                        {card.statLabel}
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="font-semibold text-ink group-hover:text-canyon transition-colors">
                  {card.label}
                </h2>
                <p className="text-sm text-ink/50 mt-0.5">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {pendingSubmissions > 0 && (
        <div className="mt-8 p-5 rounded-xl bg-amber/10 border border-amber/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Inbox size={18} className="text-amber" />
              <div>
                <p className="font-semibold text-ink text-sm">
                  {pendingSubmissions} submission{pendingSubmissions !== 1 ? "s" : ""} waiting for review
                </p>
                <p className="text-xs text-ink/50 mt-0.5">
                  Venues and activities submitted by the community
                </p>
              </div>
            </div>
            <Link
              href="/submissions"
              className="flex items-center gap-1 text-sm font-medium text-canyon hover:text-canyon-deep transition-colors"
            >
              Review <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
