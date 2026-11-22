import Link from "next/link";
import { postService } from "@dud/db";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ArrowRight, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const filters = [
  { label: "All stories", value: "all" },
  { label: "Drafts", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
];

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [posts, search] = await Promise.all([postService.getAllPosts(), searchParams]);
  const status = filters.some(({ value }) => value === search.status) ? search.status : "all";
  const results = posts.filter((post) => {
    const state = post.published ? "published" : post.scheduledAt ? "scheduled" : "draft";
    return status === "all" || status === state;
  });

  return (
    <div className="admin-page">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div>
          <h1 className="admin-heading">Stories</h1>
          <p className="mt-2 text-ink/75">Write, schedule, and update your Utah guides.</p>
        </div>
        <Link href="/posts/new" className="admin-button"><Plus size={17} aria-hidden /> New story</Link>
      </header>
      <nav aria-label="Story status" className="mb-6 flex flex-wrap gap-2">
        {filters.map(({ label, value }) => (
          <Link key={value} href={value === "all" ? "/posts" : `/posts?status=${value}`}
            aria-current={value === status ? "page" : undefined}
            className="rounded-lg border border-ink/20 px-3 py-2 text-sm font-semibold hover:bg-cream aria-[current=page]:bg-[#294331] aria-[current=page]:text-white">
            {label}
          </Link>
        ))}
      </nav>
      <section aria-label="Stories" className="admin-panel divide-y divide-ink/10">
        {results.length ? (
          <ul className="divide-y divide-ink/10">
            {results.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`} className="group flex items-center gap-4 px-4 py-4 hover:bg-sand sm:px-6">
                  <span className="min-w-0 flex-1">
                    <span className="block break-words font-semibold group-hover:text-canyon">{post.title}</span>
                    <span className="mt-1 block text-xs text-ink/75">
                      {post.scheduledAt && !post.published ? formatDateTime(post.scheduledAt) : `Edited ${formatDate(post.updatedAt)}`}
                      {post.categories[0] && ` · ${post.categories[0].name}`}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold">
                    {post.published ? "Published" : post.scheduledAt ? "Scheduled" : "Draft"}
                  </span>
                  <ArrowRight size={15} className="hidden shrink-0 text-canyon sm:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10">
            <h2 className="font-display text-3xl">No stories here yet</h2>
            <p className="mt-2 text-sm text-ink/75">Stories will appear here when they match the selected status.</p>
          </div>
        )}
      </section>
    </div>
  );
}
