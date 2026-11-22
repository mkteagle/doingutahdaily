import Link from "next/link";
import { activityService, postService, submissionService, subscriberService } from "@dud/db";
import { ArrowRight, Calendar, FileText, Inbox, Plus, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [stories, activities, submissions, subscribers] = await Promise.allSettled([
    postService.getAllPosts(),
    activityService.getPublishedActivities({ limit: 1000 }),
    submissionService.getSubmissions({ status: "pending", limit: 1000 }),
    subscriberService.getSubscriberCount(),
  ]);
  const posts = stories.status === "fulfilled" ? stories.value : [];
  const metrics = [
    { label: "Published stories", count: stories.status === "fulfilled" ? posts.filter((post) => post.published).length : null, href: "/posts?status=published" },
    { label: "Published activities", count: activities.status === "fulfilled" ? activities.value.length : null, href: "/activities" },
    { label: "Pending submissions", count: submissions.status === "fulfilled" ? submissions.value.length : null, href: "/submissions" },
    { label: "Newsletter subscribers", count: subscribers.status === "fulfilled" ? subscribers.value : null, href: "/subscribers" },
  ];

  return (
    <div className="admin-page">
      <header className="flex flex-wrap items-end justify-between gap-5 pb-7">
        <div>
          <h1 className="admin-heading">Editorial overview</h1>
          <p className="mt-2 text-ink/70">Manage stories, weekend plans, and the community submissions queue.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/capture" className="admin-secondary"><Sparkles size={16} aria-hidden /> Quick capture</Link>
          <Link href="/posts/new" className="admin-button"><Plus size={17} aria-hidden /> New story</Link>
        </div>
      </header>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ label, count, href }) => (
          <li key={label}>
            <Link href={href} className="admin-panel group flex h-full flex-col justify-between gap-3 px-4 py-4 hover:border-canyon/50 sm:px-5">
              <span className="text-sm font-medium text-ink/75">{label}</span>
              <span className="flex items-center justify-between gap-2 font-display text-4xl">
                {count ?? <span className="font-sans text-sm text-ink/65">Unavailable</span>}
                <ArrowRight size={16} className="shrink-0 text-canyon" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.45fr)]">
        <section aria-labelledby="recent-stories" className="admin-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 p-5">
            <h2 id="recent-stories" className="font-display text-3xl">Recent stories</h2>
            <Link href="/posts" className="text-sm font-semibold text-canyon hover:underline">All stories</Link>
          </div>
          {posts.length ? (
            <ul className="divide-y divide-ink/10">
              {posts.slice(0, 5).map((post) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-sand">
                    <FileText size={18} className="shrink-0 text-canyon" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{post.title}</span>
                      <span className="mt-0.5 block text-xs text-ink/75">Edited {formatDate(post.updatedAt)}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs">
                      {post.published ? "Published" : post.scheduledAt ? "Scheduled" : "Draft"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-ink/75">{stories.status === "rejected" ? "Stories are temporarily unavailable." : "Your stories will appear here as you create them."}</p>
          )}
        </section>

        <section aria-labelledby="planning" className="admin-panel h-fit p-5">
          <h2 id="planning" className="font-display text-3xl">Plan the week</h2>
          <div className="mt-3 divide-y divide-ink/15">
            {[
              { href: "/posts?status=scheduled", label: "Scheduled stories", icon: Calendar },
              { href: "/submissions", label: "Review submissions", icon: Inbox },
              { href: "/events", label: "View upcoming events", icon: Calendar },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2.5 py-4 text-sm font-semibold hover:text-canyon">
                <Icon size={17} className="text-canyon" aria-hidden /> {label} <ArrowRight size={14} className="ml-auto" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
