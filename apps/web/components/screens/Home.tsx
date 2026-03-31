"use client";

import Link from "next/link";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { format, parseISO, isThisWeek, isWeekend } from "date-fns";
import {
  ArrowRight,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  Baby,
  GraduationCap,
  TreePine,
  DollarSign,
  Sparkles,
  BadgeCheck,
  Shield,
  Eye,
} from "lucide-react";
import type { CalendarEvent } from "@/lib/googleCalendar";
import type { Blog } from "@/types/blog";
import { NewsletterForm } from "@/components/NewsletterForm";

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    return {
      day: format(d, "d"),
      month: format(d, "MMM"),
      weekday: format(d, "EEE"),
      full: format(d, "EEE, MMM d"),
      time: format(d, "h:mm a"),
    };
  } catch {
    return { day: "–", month: "–", weekday: "–", full: dateStr, time: "" };
  }
}

// ─── Jackrabbit SVG ──────────────────────────────────────────────────────────

function JackrabbitMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simplified jackrabbit silhouette — ears up, alert, always moving */}
      <path
        d="M26 8c-1 0-2.5 1-3 4-1 6 0 12 2 16M38 8c1 0 2.5 1 3 4 1 6 0 12-2 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="34" rx="12" ry="14" fill="currentColor" />
      <ellipse cx="32" cy="32" rx="10" ry="12" fill="currentColor" />
      {/* Eye */}
      <circle cx="28" cy="29" r="2" fill="hsl(var(--cream))" />
      <circle cx="28.5" cy="28.5" r="0.8" fill="hsl(var(--ink))" />
      {/* Nose */}
      <ellipse cx="25" cy="33" rx="1.5" ry="1" fill="hsl(var(--canyon-deep))" />
      {/* Back legs — in motion */}
      <path
        d="M38 44c2 3 5 8 8 10M36 45c1 3 2 9 2 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Front legs */}
      <path
        d="M26 44c-1 2-2 6-1 10M24 42c-2 2-5 5-6 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Tail */}
      <circle cx="43" cy="36" r="3" fill="currentColor" />
    </svg>
  );
}

// ─── Mountain Silhouette Background ──────────────────────────────────────────

function MountainRange({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 200L60 180L180 120L280 160L360 90L440 140L520 60L600 110L680 40L760 100L840 30L920 80L1000 50L1080 100L1160 70L1240 120L1320 90L1380 140L1440 100V200H0Z"
        fill="hsl(var(--canyon) / 0.06)"
      />
      <path
        d="M0 200L100 150L200 170L320 100L420 150L540 80L640 130L720 60L820 120L900 50L1000 90L1100 60L1200 110L1300 80L1440 130V200H0Z"
        fill="hsl(var(--canyon) / 0.04)"
      />
    </svg>
  );
}

// ─── Trust Badge ─────────────────────────────────────────────────────────────

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: typeof BadgeCheck;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sage/15 text-sage border border-sage/20">
      <Icon size={12} />
      {label}
    </span>
  );
}

// ─── Weekend Event Card ──────────────────────────────────────────────────────

function WeekendEventCard({ event }: { event: CalendarEvent }) {
  const date = formatEventDate(event.start);
  const isFree =
    event.categories?.some((c) =>
      c.toLowerCase().includes("free")
    ) ?? false;

  return (
    <div className="group relative flex gap-4 p-5 rounded-2xl bg-cream border border-border/60 hover:border-canyon/30 hover:shadow-card transition-all duration-200">
      {/* Date chip */}
      <div className="shrink-0 w-14 text-center">
        <div className="text-[10px] font-bold uppercase tracking-wider text-canyon">
          {date.weekday}
        </div>
        <div className="font-display text-2xl leading-none text-ink mt-0.5">
          {date.day}
        </div>
        <div className="text-[10px] font-medium text-muted-foreground uppercase">
          {date.month}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-sm leading-snug text-foreground line-clamp-2 group-hover:text-canyon transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            <MapPin size={11} className="shrink-0 text-sky" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2.5">
          {isFree && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage/15 text-sage uppercase tracking-wide">
              Free
            </span>
          )}
          {event.categories?.[0] && !isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky/10 text-sky">
              {event.categories[0]}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className="shrink-0 self-center text-muted-foreground/40 group-hover:text-canyon group-hover:translate-x-0.5 transition-all"
      />
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-cream border border-border/60">
      <div className="w-14 space-y-1 text-center">
        <div className="h-2.5 bg-muted rounded animate-pulse mx-auto w-8" />
        <div className="h-6 bg-muted rounded animate-pulse mx-auto w-8" />
        <div className="h-2 bg-muted rounded animate-pulse mx-auto w-6" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// ─── Blog Card ───────────────────────────────────────────────────────────────

function HomeBlogCard({ post }: { post: Blog }) {
  const { meta } = post;
  return (
    <Link
      href={`/blog/${meta.slug}`}
      className="group flex flex-col bg-cream border border-border/60 rounded-2xl overflow-hidden hover:border-canyon/30 hover:shadow-card transition-all duration-200"
    >
      {meta.coverImage && (
        <div className="aspect-[16/9] overflow-hidden bg-muted relative">
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
          <span className="self-start mb-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-canyon/10 text-canyon">
            {meta.categories[0]}
          </span>
        )}
        <h3 className="font-display text-base leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-canyon transition-colors">
          {meta.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 font-serif italic">
          {meta.excerpt}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <time className="text-xs text-muted-foreground">
            {format(parseISO(meta.date), "MMM d, yyyy")}
          </time>
          <span className="flex items-center gap-1 text-xs font-medium text-canyon group-hover:gap-2 transition-all">
            Read <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Age Band Card ───────────────────────────────────────────────────────────

function AgeBandCard({
  icon: Icon,
  ages,
  label,
  description,
  color,
}: {
  icon: typeof Baby;
  ages: string;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={`/activities?age=${ages}`}
      className={`group relative p-6 rounded-2xl border border-border/60 bg-cream hover:shadow-card transition-all duration-200 overflow-hidden`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}
      >
        <Icon size={20} />
      </div>
      <div className="font-display text-lg text-foreground mb-1 group-hover:text-canyon transition-colors">
        {label}
      </div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Ages {ages}
      </div>
      <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
        {description}
      </p>
      <ChevronRight
        size={16}
        className="absolute top-6 right-5 text-muted-foreground/30 group-hover:text-canyon group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Home() {
  const { events, loading } = useCalendarEvents({
    onlyUpcoming: true,
    maxEvents: 8,
  });
  const { posts } = useBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-sand" />
        <MountainRange className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" />
        <div className="absolute top-12 right-12 text-canyon/[0.05] pointer-events-none">
          <JackrabbitMark className="w-[400px] h-[400px] hidden lg:block" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="max-w-3xl">
            {/* Eyebrow — honest, warm */}
            <div className="inline-flex items-center gap-2.5 mb-8 animate-slide-up">
              <JackrabbitMark className="w-7 h-7 text-canyon" />
              <span className="text-sm font-semibold text-canyon tracking-wide">
                Doing Utah Daily
              </span>
            </div>

            {/* Headline — brand tagline */}
            <h1 className="animate-slide-up delay-100">
              <span className="block font-display text-5xl sm:text-6xl lg:text-7xl text-ink leading-[0.95] mb-3">
                Your family&apos;s guide to
              </span>
              <span className="block font-serif italic text-4xl sm:text-5xl lg:text-6xl text-canyon leading-[1.05]">
                everything happening
              </span>
              <span className="block font-serif italic text-4xl sm:text-5xl lg:text-6xl text-canyon leading-[1.05]">
                in Utah.
              </span>
            </h1>

            {/* Sub — brand voice */}
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl animate-slide-up delay-200">
              Saturday&apos;s wide open. Your 4-year-old wants to hike. Your
              14-year-old wants to die of embarrassment.{" "}
              <span className="text-foreground font-medium">
                We have options for both.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-10 animate-slide-up delay-300">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-canyon text-white font-semibold hover:bg-canyon-deep shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                This Weekend&apos;s Picks
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cream border border-border text-foreground font-semibold hover:bg-white transition-colors duration-200"
              >
                Browse Activities
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-3 mt-10 animate-slide-up delay-400">
              <TrustBadge icon={BadgeCheck} label="Actually went there" />
              <TrustBadge icon={Shield} label="No surprise costs" />
              <TrustBadge icon={Eye} label="Verified open" />
            </div>
          </div>
        </div>
      </section>

      {/* ── This Weekend ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-canyon mb-2">
                This Weekend
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink">
                Here&apos;s what&apos;s happening near you.
              </h2>
              <p className="font-serif italic text-muted-foreground mt-2 text-base">
                Saturday&apos;s wide open. Let&apos;s fill it.
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-canyon hover:text-canyon-deep transition-colors group"
            >
              View all{" "}
              <ArrowRight
                size={15}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))
              : events.slice(0, 8).map((event) => (
                  <WeekendEventCard key={event.id} event={event} />
                ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-sand transition-colors"
            >
              View all events <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Find by Age — the core differentiator ─────────────────────────── */}
      <section className="py-16 sm:py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky mb-2">
              Made for your family
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3">
              Find activities by age
            </h2>
            <p className="font-serif italic text-muted-foreground text-base max-w-lg mx-auto">
              Because &ldquo;family-friendly&rdquo; means something different
              when you have a toddler vs. a teenager.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AgeBandCard
              icon={Baby}
              ages="0–5"
              label="Little Explorers"
              description="Stroller-friendly. Bathroom at trailhead. Meltdown-proof activities."
              color="bg-amber/15 text-amber"
            />
            <AgeBandCard
              icon={TreePine}
              ages="6–11"
              label="Adventure Ready"
              description="~90 minutes if you set the pace. They'll actually remember this one."
              color="bg-sage/15 text-sage"
            />
            <AgeBandCard
              icon={GraduationCap}
              ages="12–17"
              label="Teen Approved"
              description="Things they won't roll their eyes at. Yes, we checked."
              color="bg-sky/15 text-sky"
            />
            <AgeBandCard
              icon={DollarSign}
              ages="All"
              label="Verified Free"
              description="No surprises. No hidden parking fees. Actually free."
              color="bg-canyon/10 text-canyon"
            />
          </div>
        </div>
      </section>

      {/* ── Trust System ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Copy */}
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-canyon mb-2">
                  No more guesswork
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink mb-4">
                  We actually went there.
                </h2>
                <p className="font-serif italic text-muted-foreground text-lg leading-relaxed mb-6">
                  Every recommendation comes from someone who loaded the kids in
                  the car, drove there, and can tell you where to park.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Honestly? Skip the touristy spot. Drive 12 more minutes and
                  you&apos;ll have the canyon to yourself. That&apos;s the kind
                  of advice you&apos;ll get from us.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      icon: BadgeCheck,
                      title: "Actually Went",
                      desc: "Every listing visited by a real person",
                    },
                    {
                      icon: Shield,
                      title: "No Surprises",
                      desc: "Verified-free means zero hidden costs",
                    },
                    {
                      icon: Clock,
                      title: "Freshness Checked",
                      desc: "Listings verified within the last 60 days",
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-sage" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual — sample activity card with badges */}
              <div className="relative">
                <div className="p-6 rounded-2xl bg-white border border-border/60 shadow-card">
                  <div className="aspect-[4/3] rounded-xl bg-sand mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground/40">
                        <TreePine size={48} className="mx-auto mb-2" />
                        <span className="text-xs font-medium">
                          Activity Photo
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage/90 text-white uppercase tracking-wider">
                        Free
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky/90 text-white uppercase tracking-wider">
                        Ages 6+
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-lg text-ink mb-1">
                    Bells Canyon Trail
                  </h3>
                  <p className="text-sm text-muted-foreground font-serif italic mb-3">
                    6 and up. Bathroom at trailhead. ~90 minutes if you set the
                    pace.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin size={12} className="text-sky" />
                    Sandy, UT
                    <span className="text-border">|</span>
                    <Clock size={12} />
                    ~90 min
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-sage">
                      <CheckCircle2 size={13} />
                      Actually went
                    </div>
                    <span className="text-border">|</span>
                    <span className="text-[11px] text-muted-foreground">
                      Verified Mar 2026
                    </span>
                  </div>
                </div>
                {/* Decorative accent */}
                <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full rounded-2xl bg-canyon/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog / Stories ─────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-sand">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-canyon mb-2">
                  Stories &amp; Guides
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink">
                  From people who live here
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-canyon hover:text-canyon-deep transition-colors group"
              >
                All posts{" "}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
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

      {/* ── Newsletter CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 bg-ink overflow-hidden">
        {/* Texture */}
        <div className="absolute inset-0 diagonal-stripe opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-canyon/[0.08] blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <JackrabbitMark className="w-12 h-12 text-canyon mx-auto mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl text-sand mb-3">
              &ldquo;This Weekend in Utah&rdquo;
            </h2>
            <p className="font-serif italic text-sand/70 text-lg mb-2">
              Every Thursday morning. The best stuff happening this weekend.
            </p>
            <p className="text-sand/50 text-sm mb-8">
              Your 4-year-old wants to hike. Your 14-year-old wants to die of
              embarrassment. We have options for both.
            </p>
            <NewsletterForm variant="dark" />
            <p className="text-xs text-sand/30 mt-4">
              No spam. Just good weekends. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3">
              Built for how your family actually works
            </h2>
            <p className="font-serif italic text-muted-foreground text-base">
              Not everyone&apos;s planning the same kind of Saturday.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Young Families", sub: "Ages 0–7" },
              { label: "Teens & Tweens", sub: "Ages 12–18" },
              { label: "Grandparents", sub: "Simple & trustworthy" },
              { label: "Budget Families", sub: "Verified free" },
              { label: "New to Utah", sub: "30-day guide" },
              { label: "Military Families", sub: "Hill AFB discounts" },
              { label: "Homeschoolers", sub: "Field trips by subject" },
              { label: "Nannies & Caregivers", sub: "Weekday mornings" },
            ].map(({ label, sub }) => (
              <div
                key={label}
                className="p-5 rounded-xl bg-sand border border-border/40 text-center hover:border-canyon/20 hover:shadow-sm transition-all"
              >
                <div className="font-semibold text-sm text-foreground mb-1">
                  {label}
                </div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner CTA ───────────────────────────────────────────────────── */}
      <section className="py-12 bg-sand border-t border-border/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-canyon/[0.06] border border-canyon/15">
            <div>
              <h3 className="font-display text-xl sm:text-2xl text-ink mb-1">
                Got a Utah event to share?
              </h3>
              <p className="text-sm text-muted-foreground font-serif italic">
                We partner with venues, organizers, and local businesses to
                spread the word.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-canyon text-white font-semibold text-sm hover:bg-canyon-deep transition-colors"
            >
              Partner with us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
