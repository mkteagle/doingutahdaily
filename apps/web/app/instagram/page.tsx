import { socialService } from "@dud/db";
import { ArrowLeft, ArrowRight, Instagram } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstagramPostCard } from "@/components/Home/InstagramPostCard";
import { INSTAGRAM_URL } from "@/lib/social";
import { pageMetadata } from "@/lib/pageMetadata";

const PAGE_SIZE = 12;
const filters = [
  { value: "", label: "All posts", mediaType: undefined },
  { value: "video", label: "Videos & Reels", mediaType: "VIDEO" },
  { value: "carousel", label: "Carousels", mediaType: "CAROUSEL" },
] as const;

type PageProps = { searchParams: Promise<{ type?: string; page?: string }> };

function readParams(params: Awaited<PageProps["searchParams"]>) {
  const filter = filters.find(({ value }) => value === params.type) ?? filters[0];
  const requested = Number(params.page);
  const page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
  return { filter, page };
}

function pageUrl(type: string, page = 1) {
  const query = new URLSearchParams();
  if (type) query.set("type", type);
  if (page > 1) query.set("page", String(page));
  return query.size ? `/instagram?${query}` : "/instagram";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { filter, page } = readParams(await searchParams);
  return {
    ...pageMetadata({
      path: pageUrl("", filter.value ? 1 : page),
      title: page === 1 ? "From Instagram" : `From Instagram – Page ${page}`,
      description: "Photos, videos, and family outings from Doing Utah Daily’s Instagram archive.",
    }),
    robots: filter.value ? { index: false, follow: true } : undefined,
  };
}

export default async function InstagramPage({ searchParams }: PageProps) {
  const { filter, page } = readParams(await searchParams);
  const options = { platform: "instagram", mediaType: filter.mediaType } as const;
  const count = await socialService.countSocialPosts(options);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (page > pages) notFound();
  const posts = count ? await socialService.getSocialPosts({
    ...options,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  }) : [];

  return (
    <div className="field-container field-section">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-7 pt-3 sm:pb-9 sm:pt-8">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-6xl">From Instagram</h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">Trail days, family outings, and everyday adventures around Utah.</p>
        </div>
        <a href={INSTAGRAM_URL} className="field-action-link">
          <Instagram size={19} aria-hidden /> Follow @doingutahdaily <ArrowRight size={16} aria-hidden />
        </a>
      </header>
      <nav aria-label="Instagram post types" className="my-6 flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <Link key={value} href={pageUrl(value)} aria-current={filter.value === value ? "page" : undefined}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary aria-[current=page]:bg-foreground aria-[current=page]:text-background">
            {label}
          </Link>
        ))}
      </nav>
      {posts.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 pb-6 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => <li key={post.id}><InstagramPostCard post={post} showCaption /></li>)}
        </ul>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-9">
          <h2 className="font-display text-2xl">{filter.value ? "No posts of this type yet" : "Find us on Instagram"}</h2>
          <p className="mt-2 text-muted-foreground">See our latest posts, reels, and updates on our profile.</p>
          <a href={INSTAGRAM_URL} className="field-action-link mt-4">Open Instagram <ArrowRight size={16} aria-hidden /></a>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Instagram archive pages" className="my-5 flex flex-wrap items-center gap-5 border-t border-border pt-5">
          {page > 1 && <Link href={pageUrl(filter.value, page - 1)} className="field-action-link"><ArrowLeft size={16} aria-hidden /> Newer posts</Link>}
          <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
          {page < pages && <Link href={pageUrl(filter.value, page + 1)} className="field-action-link">Older posts <ArrowRight size={16} aria-hidden /></Link>}
        </nav>
      )}
    </div>
  );
}
