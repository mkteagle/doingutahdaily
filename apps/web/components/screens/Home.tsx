"use client";
import { useTheme } from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { PartnershipCTA } from "../Home/PartnershipCTA";
import { EventCarousel } from "../Home/EventCarousel";
import { CalendarDays, Sparkles, ArrowRight } from "lucide-react";

export function Home() {
  const { colorMode } = useTheme();
  const { events, loading, error } = useCalendarEvents({ onlyUpcoming: true });

  return (
    <>
      {/* Hero Section - Dramatic, Layered Design with Seasonal Colors */}
      <section className="relative overflow-hidden seasonal-gradient min-h-[85vh] flex items-center grain">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[hsl(var(--seasonal-secondary))] opacity-20 blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--seasonal-accent))] opacity-20 blur-3xl top-1/3 right-0 animate-float delay-300" style={{ animationDelay: '2s' }}></div>
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--seasonal-primary))] opacity-30 blur-3xl bottom-0 left-1/3 animate-float delay-500" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-white/20 rotate-12 animate-rotate-slow"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse-glow"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white/15 rounded-full"></div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-20"></div>

        <div className="relative container mx-auto px-6 lg:px-12 py-20 z-10">
          <div className="max-w-4xl">
            {/* Eyebrow text */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-slide-up">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                UTAH'S PREMIER EVENT GUIDE
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-7xl lg:text-8xl xl:text-9xl text-white mb-6 leading-[0.95] animate-slide-up delay-100">
              <span className="block text-balance">Discover</span>
              <span className="block text-balance">Utah's</span>
              <span className="block text-white/90 italic font-serif text-6xl lg:text-7xl xl:text-8xl -mt-2">
                Magic Daily
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-serif text-2xl lg:text-3xl text-white/95 mb-12 max-w-2xl leading-relaxed animate-slide-up delay-200">
              Your daily compass to family-friendly events, hidden gems, and unforgettable
              adventures across the Beehive State.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Button
                size="lg"
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-brutal hover-lift group"
              >
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--primary))] font-bold text-lg px-8 py-6 rounded-2xl backdrop-blur-sm bg-white/10 hover-lift"
              >
                <CalendarDays className="mr-2 w-5 h-5" />
                View Calendar
              </Button>
            </div>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-6 mt-16 animate-slide-up delay-400">
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="text-3xl font-display text-white">500+</div>
                <div className="text-sm text-white/80 font-medium">Monthly Events</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="text-3xl font-display text-white">50K+</div>
                <div className="text-sm text-white/80 font-medium">Happy Families</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="text-3xl font-display text-white">24/7</div>
                <div className="text-sm text-white/80 font-medium">Updated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={colorMode === 'dark' ? 'hsl(15, 25%, 12%)' : 'hsl(45, 35%, 97%)'}
            />
          </svg>
        </div>
      </section>

      {/* Featured Section - Magazine Style */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="inline-block mb-4">
                <span className="text-[hsl(var(--primary))] font-bold text-sm tracking-widest uppercase">
                  What's Happening
                </span>
                <div className="h-1 bg-[hsl(var(--primary))] mt-2"></div>
              </div>
              <h2 className="font-display text-5xl lg:text-6xl text-[hsl(var(--foreground))] leading-tight">
                Upcoming
                <span className="block font-serif italic text-[hsl(var(--primary))]">
                  Adventures
                </span>
              </h2>
            </div>

            <Button
              variant="ghost"
              className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] font-bold group hidden lg:flex"
            >
              View All Events
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <EventCarousel events={events} loading={loading} error={error} />
        </div>
      </section>

      {/* Categories Section - Grid Layout */}
      <section className="relative py-24 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--muted))] grain">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="font-display text-4xl lg:text-5xl text-center mb-4 text-[hsl(var(--foreground))]">
            Explore by Category
          </h2>
          <p className="font-serif text-xl text-center text-[hsl(var(--muted-foreground))] mb-16 max-w-2xl mx-auto">
            From outdoor adventures to cultural experiences, find exactly what you're looking for
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Outdoor', emoji: '🏔️', color: 'hsl(var(--sage))' },
              { name: 'Arts & Culture', emoji: '🎨', color: 'hsl(var(--sunset))' },
              { name: 'Food & Drink', emoji: '🍽️', color: 'hsl(var(--canyon))' },
              { name: 'Family Fun', emoji: '👨‍👩‍👧‍👦', color: 'hsl(var(--primary))' },
              { name: 'Sports', emoji: '⚽', color: 'hsl(var(--accent))' },
              { name: 'Music', emoji: '🎵', color: 'hsl(var(--sky))' },
              { name: 'Education', emoji: '📚', color: 'hsl(var(--sage))' },
              { name: 'Festivals', emoji: '🎪', color: 'hsl(var(--sunset))' },
            ].map((category, index) => (
              <button
                key={category.name}
                className="group relative bg-white dark:bg-[hsl(var(--foreground)/0.05)] rounded-2xl p-8 text-center hover-lift shadow-lg overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                     style={{ backgroundColor: category.color }}></div>
                <div className="text-5xl mb-3">{category.emoji}</div>
                <div className="font-bold text-[hsl(var(--foreground))]">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Bold CTA */}
      <section className="relative py-32 overflow-hidden bg-[hsl(var(--foreground))] text-white grain">
        <div className="absolute inset-0 opacity-5 diagonal-stripe"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rotate-45"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm tracking-wide">NEVER MISS OUT</span>
            </div>

            <h2 className="font-display text-5xl lg:text-6xl mb-6 leading-tight">
              Get the Best Events
              <span className="block font-serif italic text-[hsl(var(--accent))]">
                Delivered Daily
              </span>
            </h2>

            <p className="font-serif text-xl mb-10 text-white/90 leading-relaxed">
              Join 50,000+ Utah families staying in the loop with our daily event digest
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[hsl(var(--accent))] font-medium"
              />
              <Button
                size="lg"
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--canyon))] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover-lift whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-white/60 mt-6">
              No spam, unsubscribe anytime. We respect your inbox.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <PartnershipCTA />
    </>
  );
}
