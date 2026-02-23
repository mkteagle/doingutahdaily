"use client";

import Link from "next/link";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { format, parseISO } from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Mountain,
  Sun,
  Users,
  Compass,
  ChevronRight,
} from "lucide-react";
import type { CalendarEvent } from "@/lib/googleCalendar";
import type { Blog } from "@/types/blog";

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    return {
      day: format(d, "d"),
      month: format(d, "MMM"),
      full: format(d, "EEE, MMM d"),
      time: format(d, "h:mm a"),
    };
  } catch {
    return { day: "–", month: "–", full: dateStr, time: "" };
  }
}

// ─── Event Card ────────────────────────────────────────────────────────────────

function HomeEventCard({ event }: { event: CalendarEvent }) {
  const date = formatEventDate(event.start);
  return (
    <div className="group flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200">
      {/* Date badge */}
      <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
        <span className="font-display text-xl leading-none">{date.day}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{date.month}</span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-sm leading-snug text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        {event.categories && event.categories.length > 0 && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent">
            {event.categories[0]}
          </span>
        )}
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
      <div className="w-14 h-14 rounded-xl bg-muted animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function HomeBlogCard({ post }: { post: Blog }) {
  const { meta } = post;
  return (
    <Link
      href={`/blog/${meta.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200"
    >
      {meta.coverImage && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        {meta.categories && meta.categories.length > 0 && (
          <span className="inline-block mb-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
            {meta.categories[0]}
          </span>
        )}
        <h3 className="font-display text-base leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {meta.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 font-serif">
          {meta.excerpt}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <time className="text-xs text-muted-foreground">
            {format(parseISO(meta.date), "MMM d, yyyy")}
          </time>
          <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
            Read <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function Home() {
  const { events, loading } = useCalendarEvents({ onlyUpcoming: true, maxEvents: 6 });
  const { posts } = useBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 brand-gradient-radial" />
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
              <Mountain size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                Utah&apos;s Family Event Guide
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-foreground leading-[0.95] mb-6 animate-slide-up delay-100">
              <span className="block">Find Your</span>
              <span className="block text-gradient">Next Utah</span>
              <span className="block font-serif italic font-normal text-foreground/80 text-5xl sm:text-6xl lg:text-7xl">
                Adventure
              </span>
            </h1>

            {/* Sub */}
            <p className="font-serif text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-slide-up delay-200">
              Discover family-friendly events, hidden gems, and weekend plans
              across the Beehive State — updated daily.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                Browse Events
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted transition-colors duration-200"
              >
                <Calendar size={17} />
                Read the Blog
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16 animate-slide-up delay-400">
              {[
                { value: "500+", label: "Monthly events" },
                { value: "50K+", label: "Utah families" },
                { value: "Daily", label: "Updates" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl text-primary">{value}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
                What&apos;s on
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              View all <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
              : events.slice(0, 6).map((event) => (
                  <HomeEventCard key={event.id} event={event} />
                ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View all events <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Utah Daily ────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              Utah is calling
            </h2>
            <p className="font-serif text-lg text-muted-foreground max-w-xl mx-auto">
              From red rock canyons to mountain festivals — there&apos;s always
              something extraordinary happening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Discover hidden gems",
                body: "We surface the events and activities that Utah travel guides miss — local, authentic, and family-friendly.",
              },
              {
                icon: Sun,
                title: "Every season, every age",
                body: "Whether it's ski season, spring bloom, or summer festivals — we keep you in the loop year-round.",
              },
              {
                icon: Users,
                title: "Built for families",
                body: "Every recommendation is curated with families in mind — safe, affordable, and genuinely fun for all ages.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-7 rounded-2xl bg-card border border-border"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-serif">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Blog Posts ─────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
                  Stories &amp; guides
                </p>
                <h2 className="font-display text-4xl sm:text-5xl text-foreground">
                  From the Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                All posts <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <HomeBlogCard key={post.meta.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter / CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-foreground">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl sm:text-5xl text-background mb-4">
              Never miss an adventure
            </h2>
            <p className="font-serif text-lg text-background/70 mb-8">
              Get the week&apos;s best Utah events in your inbox every Sunday morning.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-5 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-background/40 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-background/40 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── Partner CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-primary/5 border border-primary/15">
            <div>
              <h3 className="font-display text-2xl text-foreground mb-1">
                Got a Utah event to share?
              </h3>
              <p className="text-sm text-muted-foreground font-serif">
                We partner with venues, organizers, and local businesses to spread the word.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Partner with us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
