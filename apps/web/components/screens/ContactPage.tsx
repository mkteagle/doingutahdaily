"use client";

import { useState } from "react";
import { Mail, MapPin, Send, Target, Zap, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Engaged local audience",
    description:
      "Reach 50,000+ Utah families actively looking for local experiences and adventures.",
  },
  {
    icon: Zap,
    title: "Expert event coverage",
    description:
      "Authentic storytelling and professional content creation for your event or venue.",
  },
  {
    icon: TrendingUp,
    title: "Extended reach",
    description:
      "Multi-platform promotion across our blog, newsletter, and social channels.",
  },
];

function ContactForm() {
  const [state, setState] = useState({ name: "", email: "", message: "", sent: false, sending: false });

  const handle = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setState((s) => ({ ...s, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, sending: true }));
    await new Promise((r) => setTimeout(r, 800));
    setState((s) => ({ ...s, sending: false, sent: true }));
  };

  if (state.sent) {
    return (
      <div className="py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Send size={24} className="text-primary" />
        </div>
        <p className="font-display text-xl text-foreground mb-2">Message sent!</p>
        <p className="text-sm text-muted-foreground font-serif">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Name</label>
          <input
            required
            value={state.name}
            onChange={handle("name")}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
          <input
            required
            type="email"
            value={state.email}
            onChange={handle("email")}
            placeholder="you@email.com"
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Type of partnership</label>
        <select
          className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
          onChange={handle("type")}
        >
          <option value="">Select one…</option>
          <option>Event promotion</option>
          <option>Sponsored content</option>
          <option>Venue spotlight</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Message</label>
        <textarea
          required
          value={state.message}
          onChange={handle("message")}
          rows={5}
          placeholder="Tell us about your event, venue, or partnership idea…"
          className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={state.sending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {state.sending ? "Sending…" : <><Send size={15} /> Send message</>}
      </button>
    </form>
  );
}

export function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Partnerships
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-4 leading-[1.0]">
            Let&apos;s work
            <span className="block font-serif italic font-normal text-foreground/70">
              together
            </span>
          </h1>
          <p className="font-serif text-lg text-muted-foreground max-w-xl">
            Partner with Utah&apos;s family event guide to showcase your venue,
            event, or experience to thousands of engaged local families.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left: Why partner */}
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-6">
                Why partner with us?
              </h2>
              <div className="space-y-4">
                {FEATURES.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-base text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground font-serif leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-4">
              <h3 className="font-display text-lg text-foreground">Reach us directly</h3>
              <a
                href="mailto:hello@doingutahdaily.com"
                className="flex items-center gap-3 group"
              >
                <Mail size={15} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  hello@doingutahdaily.com
                </span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={15} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">Salt Lake City, Utah</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                We respond to all inquiries within 24 hours.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
              <h3 className="font-display text-2xl text-foreground mb-2">Get in touch</h3>
              <p className="text-sm text-muted-foreground font-serif mb-6">
                Tell us about your event, venue, or collaboration idea and we&apos;ll get back to you.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
