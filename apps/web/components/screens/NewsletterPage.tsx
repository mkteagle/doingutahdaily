"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  BadgeCheck,
  ArrowRight,
  Star,
} from "lucide-react";

export function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Hero */}
      <section className="bg-ink relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripe opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-canyon/[0.08] blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canyon/15 border border-canyon/25 mb-8">
              <Mail size={14} className="text-canyon" />
              <span className="text-xs font-bold uppercase tracking-wider text-canyon">
                Free Thursday Newsletter
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-sand leading-[0.95] mb-6">
              &ldquo;This Weekend
              <br />
              <span className="font-serif italic text-canyon">in Utah&rdquo;</span>
            </h1>

            <p className="font-serif italic text-sand/70 text-xl sm:text-2xl max-w-2xl mx-auto mb-4 leading-relaxed">
              Every Thursday morning. The best stuff happening this weekend,
              curated for families who&apos;d rather be outside than scrolling.
            </p>

            <p className="text-sand/50 text-base mb-10 max-w-lg mx-auto">
              Your 4-year-old wants to hike. Your 14-year-old wants to die of
              embarrassment. We have options for both.
            </p>

            {result ? (
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-sage/15 border border-sage/25">
                <CheckCircle2 size={20} className="text-sage" />
                <span className="text-sand font-medium">{result.message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/15 text-sand placeholder:text-sand/40 text-base focus:outline-none focus:border-canyon/50 focus:bg-white/[0.12] transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 rounded-xl bg-canyon text-white font-semibold text-base hover:bg-canyon-deep transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin mx-auto" />
                  ) : (
                    "Subscribe Free"
                  )}
                </button>
              </form>
            )}

            {error && (
              <p className="text-destructive text-sm mt-4">{error}</p>
            )}

            <p className="text-xs text-sand/30 mt-4">
              No spam. Just good weekends. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3">
              What lands in your inbox
            </h2>
            <p className="font-serif italic text-muted-foreground text-lg">
              Short. Honest. Actually useful.
            </p>
          </div>

          {/* Newsletter preview mockup */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-white shadow-card overflow-hidden">
              {/* Email header */}
              <div className="px-6 py-4 border-b border-border/40 bg-sand/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-canyon flex items-center justify-center text-white font-display text-sm">
                    D
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-ink">
                      Doing Utah Daily
                    </div>
                    <div className="text-xs text-muted-foreground">
                      This Weekend in Utah — March 29–30
                    </div>
                  </div>
                </div>
              </div>

              {/* Email body */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-display text-2xl text-ink mb-2">
                    Saturday&apos;s wide open.
                  </h3>
                  <p className="text-muted-foreground font-serif italic">
                    Here&apos;s what&apos;s happening near you.
                  </p>
                </div>

                {/* Sample picks */}
                {[
                  {
                    badge: "FREE",
                    badgeColor: "bg-sage/15 text-sage",
                    title: "Sugarhouse Farmers Market",
                    detail: "1000 E 2100 S, SLC | 9am–1pm",
                    note: "Stroller-friendly. Great donut truck at the south end.",
                  },
                  {
                    badge: "AGES 6+",
                    badgeColor: "bg-sky/15 text-sky",
                    title: "Bells Canyon Trail",
                    detail: "Sandy, UT | ~90 min round trip",
                    note: "Bathroom at trailhead. Pack snacks — no concessions.",
                  },
                  {
                    badge: "RAINY DAY",
                    badgeColor: "bg-amber/15 text-amber",
                    title: "Discovery Gateway Museum",
                    detail: "Gateway Mall, SLC | 10am–6pm | $14.50",
                    note: "Skip the touristy first floor. Third floor is where it's at.",
                  },
                ].map(({ badge, badgeColor, title, detail, note }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl bg-sand/50 border border-border/40"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
                      >
                        {badge}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-ink">
                          {title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {detail}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 font-serif italic">
                          {note}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground font-serif italic">
                    + 4 more picks in the full newsletter...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Subscribe */}
      <section className="py-16 sm:py-20 bg-sand">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Every Thursday",
                body: "Arrives before the weekend planning conversation starts. We know the drill.",
              },
              {
                icon: BadgeCheck,
                title: "Actually verified",
                body: "We don't just aggregate events. Someone on our team went there.",
              },
              {
                icon: MapPin,
                title: "Real logistics",
                body: "Parking, bathrooms, crowd levels, the stuff Google doesn't tell you.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl bg-cream border border-border/50">
                <div className="w-10 h-10 rounded-xl bg-canyon/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-canyon" />
                </div>
                <h3 className="font-display text-base text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-cream border-t border-border/50">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-2xl text-ink mb-3">
            Most people drive past Helper.
          </h2>
          <p className="font-serif italic text-muted-foreground text-lg mb-8">
            Most people are wrong. Don&apos;t miss the good stuff.
          </p>
          {!result && (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 px-5 py-3.5 rounded-xl bg-sand border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3.5 rounded-xl bg-canyon text-white font-semibold text-sm hover:bg-canyon-deep transition-colors"
              >
                Subscribe Free
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
