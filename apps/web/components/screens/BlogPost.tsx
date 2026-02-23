"use client";

import Link from "next/link";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { MDXRemote } from "next-mdx-remote";
import { useMDXComponents } from "@/app/mdxComponents";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 animate-pulse">
      <div className="h-4 bg-muted rounded w-24 mb-8" />
      <div className="h-8 bg-muted rounded w-1/3 mb-4" />
      <div className="h-12 bg-muted rounded w-4/5 mb-4" />
      <div className="h-12 bg-muted rounded w-3/5 mb-10" />
      <div className="aspect-[16/9] bg-muted rounded-2xl mb-10" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    </div>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const components = useMDXComponents();
  const { post, loading, error } = useBlogPost(slug);

  if (loading) return <PostSkeleton />;

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="font-display text-2xl text-foreground mb-3">Post not found</p>
        <p className="text-muted-foreground mb-8 font-serif">
          This article doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Blog
        </Link>
      </div>
    );
  }

  const { meta, content } = post;

  return (
    <>
      {/* Hero */}
      {meta.coverImage && (
        <div className="w-full aspect-[21/8] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 py-12">
          {/* Article */}
          <article>
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group transition-colors"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              All articles
            </Link>

            {/* Meta */}
            {meta.categories && meta.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {meta.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] mb-6">
              {meta.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
              {meta.author?.name && (
                <span className="flex items-center gap-1.5">
                  <User size={13} /> {meta.author.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                <time>{format(parseISO(meta.date), "MMMM d, yyyy")}</time>
              </span>
              {meta.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {meta.readingTime}
                </span>
              )}
            </div>

            {/* MDX Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:font-serif prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-card prose-blockquote:border-l-primary prose-blockquote:font-serif">
              <MDXRemote {...content} components={components} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Author card */}
              {meta.author && (
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Author
                  </p>
                  <div className="flex items-center gap-3">
                    {meta.author.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={meta.author.picture}
                        alt={meta.author.name}
                        className="w-10 h-10 rounded-full object-cover bg-muted"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                    <span className="font-medium text-sm text-foreground">
                      {meta.author.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Categories */}
              {meta.categories && meta.categories.length > 0 && (
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {meta.categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/blog?categories=${encodeURIComponent(cat)}`}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blog */}
              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft size={14} /> All articles
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
