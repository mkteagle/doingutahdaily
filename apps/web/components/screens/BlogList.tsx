import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Search } from "lucide-react";
import type { postService } from "@dud/db";
import { blogArchiveUrl, type BlogFilters } from "@/lib/blogArchive";
import { BlogAdvertisement, BlogSupport } from "@/components/Blog/BlogRevenue";

type Story = Awaited<ReturnType<typeof postService.getPublishedPostSummaries>>[number];

function StoryCard({ post, featured = false }: { post: Story; featured?: boolean }) {
  const date = post.publishedAt ?? post.createdAt;

  return (
    <article className={featured ? "overflow-hidden rounded-2xl border border-border bg-card md:grid md:grid-cols-2" : "border-b border-border pb-6"}>
      <Link href={`/blog/${post.slug}`} className={featured ? "group grid md:col-span-2 md:grid-cols-2" : "group block"}>
        {post.coverImage && (
          <div className={featured ? "aspect-[3/2] overflow-hidden bg-muted md:h-full md:aspect-auto" : "mb-4 aspect-[3/2] overflow-hidden rounded-xl bg-muted"}>
            {/* Archive images include external URLs from the original blog. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              width={720}
              height={480}
              loading={featured ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          </div>
        )}
        <div className={featured ? "flex flex-col justify-center p-6 sm:p-10" : ""}>
          {post.categories[0] && <p className="mb-2 text-sm font-semibold text-primary">{post.categories[0].name}</p>}
          <h2 className={`font-display leading-tight group-hover:text-primary ${featured ? "text-3xl sm:text-5xl" : "text-2xl"}`}>
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <time dateTime={date.toISOString()} className="mt-4 block text-sm text-muted-foreground">
            {format(date, "MMM d, yyyy")}
          </time>
        </div>
      </Link>
    </article>
  );
}

export default function BlogList({
  posts, categories, filters, pages, count,
}: {
  posts: Story[];
  categories: string[];
  filters: BlogFilters;
  pages: number;
  count: number;
}) {
  const isArchiveStart = filters.page === 1 && !filters.search && filters.categories.length === 0;
  const featured = isArchiveStart ? posts[0] : undefined;

  return (
    <div className="field-container pb-14">
      <nav aria-label="Breadcrumb" className="py-5 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">Stories</span>
      </nav>
      <header className="pb-8 pt-3 sm:pt-8">
        <h1 className="font-display text-4xl leading-tight sm:text-6xl">Utah stories &amp; guides</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          First-hand ideas for days out, local favorites, and adventures across Utah.
        </p>
      </header>

      <div className="mb-8 border-y border-border py-5">
        <form action="/blog" role="search" className="flex items-stretch gap-2 sm:max-w-lg">
          {filters.categories.length > 0 && <input type="hidden" name="categories" value={filters.categories.join(",")} />}
          <label className="sr-only" htmlFor="story-search">Search stories</label>
          <input id="story-search" type="search" name="search" defaultValue={filters.search} maxLength={120}
            placeholder="Search stories" className="min-w-0 flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-base" />
          <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#273e2b] px-4 text-white hover:bg-[#39523b]">
            <Search size={16} aria-hidden /> Search
          </button>
        </form>
        <nav aria-label="Story topics" className="mt-4 flex flex-wrap gap-2">
          <Link href={blogArchiveUrl({ search: filters.search })} aria-current={!filters.categories.length ? "page" : undefined}
            className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground">
            All topics
          </Link>
          {categories.map((category) => {
            const selected = filters.categories.includes(category);
            const nextCategories = selected ? filters.categories.filter((item) => item !== category) : [...filters.categories, category];
            return (
              <Link key={category} href={blogArchiveUrl({ search: filters.search, categories: nextCategories })}
                aria-label={selected ? `Remove ${category} filter` : `Filter by ${category}`}
                aria-current={selected ? "true" : undefined}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary aria-current:bg-primary aria-current:text-primary-foreground">
                {category}
              </Link>
            );
          })}
        </nav>
      </div>

      {featured && <StoryCard post={featured} featured />}
      {count > 0 ? (
        <section className="mt-8" aria-label="Stories">
          <div className="mb-6"><BlogAdvertisement /></div>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {(featured ? posts.slice(1) : posts).map((post) => <StoryCard key={post.slug} post={post} />)}
          </div>
        </section>
      ) : (
        <div className="py-12">
          <h2 className="font-display text-3xl">No matching stories</h2>
          <Link className="field-action-link mt-3" href="/blog">See all stories <ArrowRight size={17} aria-hidden /></Link>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Story pages" className="my-9 flex flex-wrap items-center gap-2">
          {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
            <Link key={page} href={blogArchiveUrl({ ...filters, page })}
              aria-label={`Page ${page}`} aria-current={filters.page === page ? "page" : undefined}
              className="grid size-10 place-items-center rounded-lg border border-border hover:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground">
              {page}
            </Link>
          ))}
          {filters.page < pages && <Link className="field-action-link ml-2" href={blogArchiveUrl({ ...filters, page: filters.page + 1 })}>Next <ArrowRight size={16} aria-hidden /></Link>}
        </nav>
      )}
      <div className="mt-10"><BlogSupport /></div>
    </div>
  );
}
