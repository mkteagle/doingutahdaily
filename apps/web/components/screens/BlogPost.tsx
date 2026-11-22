import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { BlogMeta } from "@/types/blog";
import { BlogAdvertisement, BlogSupport } from "@/components/Blog/BlogRevenue";
import { blogArchiveUrl } from "@/lib/blogArchive";

export function BlogPost({
  meta, children, sections, related,
}: {
  meta: BlogMeta;
  children: ReactNode;
  sections: { id: string; label: string }[];
  related: { slug: string; title: string }[];
}) {
  return (
    <div className="field-container pb-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-5 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:underline">Stories</Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1" aria-current="page">{meta.title}</span>
      </nav>

      <div className="grid gap-10 pt-3 sm:pt-7 lg:grid-cols-[minmax(0,48rem)_minmax(14rem,18rem)] lg:justify-between lg:gap-14">
        <article className="min-w-0">
          <header>
            {meta.categories.length > 0 && (
              <p className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                {meta.categories.map((category) => (
                  <Link key={category} href={blogArchiveUrl({ categories: [category] })}
                    className="text-sm font-semibold text-primary hover:underline">{category}</Link>
                ))}
              </p>
            )}
            <h1 className="font-display text-[clamp(2.35rem,4.9vw,4.8rem)] leading-[1.12]">{meta.title}</h1>
            {meta.excerpt && <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground sm:text-xl">{meta.excerpt}</p>}
            <div className="my-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-3 text-sm text-muted-foreground">
              <span>By {meta.author.name}</span>
              <time dateTime={meta.date}>{format(parseISO(meta.date), "MMMM d, yyyy")}</time>
              {meta.readingTime && <span>{meta.readingTime}</span>}
            </div>
          </header>
          {meta.coverImage && (
            /* Existing stories include source images on multiple hosts. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={meta.coverImage} alt={meta.title} width={960} height={640} fetchPriority="high"
              className="mb-7 aspect-[3/2] w-full rounded-xl bg-muted object-cover sm:aspect-video" />
          )}
          {sections.length > 0 && (
            <nav className="mb-7 rounded-xl border border-border bg-card p-5 lg:hidden" aria-label="In this guide">
              <GuideLinks sections={sections} />
            </nav>
          )}
          <div className="field-article-body">{children}</div>
          <div className="mt-8 lg:hidden"><BlogAdvertisement /></div>
        </article>
        <div className="space-y-6 lg:pt-[10.5rem]">
          {sections.length > 0 && (
            <nav className="hidden rounded-xl border border-border bg-card p-5 lg:block" aria-label="In this guide">
              <GuideLinks sections={sections} />
            </nav>
          )}
          <div className="hidden lg:block"><BlogAdvertisement /></div>
          <BlogSupport />
          {related.length > 0 && (
            <aside aria-label="Related stories" className="border-t border-border pt-5">
              <h2 className="mb-3 font-display text-3xl">Keep exploring</h2>
              <ul className="space-y-3">
                {related.map(({ slug, title }) => (
                  <li key={slug}><Link href={`/blog/${slug}`} className="field-action-link">{title} <ArrowRight size={14} className="shrink-0" aria-hidden /></Link></li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function GuideLinks({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <>
      <h2 className="mb-3 font-display text-3xl">In this guide</h2>
      <ul className="space-y-2">
        {sections.map(({ id, label }) => (
          <li key={id}><a href={`#${id}`} className="text-sm text-primary hover:underline">{label}</a></li>
        ))}
      </ul>
    </>
  );
}
