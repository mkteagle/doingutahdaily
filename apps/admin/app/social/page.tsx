import { socialService } from "@dud/db";
import { ExternalLink, Instagram } from "lucide-react";
import Link from "next/link";
import { InstagramSyncButton } from "@/components/InstagramSyncButton";
import { formatDate } from "@/lib/utils";

const filters = [
  { label: "All posts", value: undefined },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
] as const;

export default async function SocialPage({ searchParams }: { searchParams: Promise<{ platform?: string }> }) {
  const { platform: requested } = await searchParams;
  const platform = requested === "instagram" || requested === "tiktok" ? requested : undefined;
  const configured = Boolean(process.env.INSTAGRAM_GRAPH_TOKEN?.trim());
  const [posts, total] = await Promise.all([
    socialService.getSocialPosts({ platform, limit: 24 }),
    socialService.countSocialPosts({ platform }),
  ]);

  return (
    <div className="admin-page">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="admin-heading">Social feed</h1>
          <p className="mt-2 text-ink/70">Review posts imported into the Doing Utah Daily archive.</p>
        </div>
        <InstagramSyncButton configured={configured} />
      </header>
      {!configured && (
        <div className="admin-panel mb-6 p-5">
          <p className="font-semibold">Connect @doingutahdaily</p>
          <p className="mt-1 text-sm text-ink/75">
            Generate an Instagram Login access token for the account, then set <code>INSTAGRAM_GRAPH_TOKEN</code> on the admin server.
          </p>
          <a href="https://developers.facebook.com/apps/" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-canyon hover:underline">
            Open Meta App Dashboard <ExternalLink size={14} aria-hidden />
          </a>
        </div>
      )}
      <nav aria-label="Social platforms" className="mb-5 flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <Link key={label} href={value ? `/social?platform=${value}` : "/social"}
            aria-current={value === platform ? "page" : undefined}
            className="rounded-lg border border-ink/20 px-3 py-2 text-sm font-semibold hover:bg-cream aria-[current=page]:bg-[#294331] aria-[current=page]:text-white">
            {label}
          </Link>
        ))}
      </nav>
      {posts.length ? (
        <>
          <p className="mb-3 text-sm text-ink/75">Showing {posts.length} of {total} posts</p>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => {
              const image = post.thumbnailUrl ?? (post.mediaType === "VIDEO" ? null : post.mediaUrl);
              return (
                <li key={post.id} className="admin-panel overflow-hidden">
                  <a href={post.permalink} aria-label={post.caption?.slice(0, 100) || "Open social post"} className="block hover:bg-sand">
                    <div className="grid aspect-square place-items-center overflow-hidden bg-sand">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : <Instagram size={23} aria-hidden />}
                    </div>
                    <div className="p-3">
                      <p className="text-xs capitalize text-ink/70">{post.platform} · {formatDate(post.timestamp)}</p>
                      {post.caption && <p className="mt-2 line-clamp-2 text-sm">{post.caption}</p>}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="admin-panel p-6"><p className="text-sm text-ink/75">No posts have been imported for this view yet.</p></div>
      )}
    </div>
  );
}
