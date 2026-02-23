"use client";

import Link from "next/link";
import { Mountain, Instagram, Facebook, Mail, MapPin, ArrowRight } from "lucide-react";

const LINKS = {
  explore: [
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Partner with us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
                <Mountain size={19} strokeWidth={2.5} />
              </span>
              <div className="leading-none">
                <div className="font-display text-base text-background">Doing Utah Daily</div>
              </div>
            </Link>

            <p className="font-serif text-background/75 leading-relaxed mb-8 max-w-sm italic">
              Your trusted guide to family-friendly events and unforgettable
              adventures across the Beehive State.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mb-8">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Mail, label: "Email", href: "mailto:hello@doingutahdaily.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium text-background/80 mb-3">
                Weekly event highlights, straight to your inbox
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-background/40 focus:bg-background/15 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Explore links */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-background/50 mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {LINKS.explore.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-background/70 hover:text-background text-sm font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-background/50 mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-background/50 mt-0.5 shrink-0" />
                <a
                  href="mailto:hello@doingutahdaily.com"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  hello@doingutahdaily.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-background/50 mt-0.5 shrink-0" />
                <span className="text-sm text-background/70">
                  Salt Lake City, Utah
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/15 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} Doing Utah Daily. All rights reserved.
          </p>
          <div className="flex gap-6">
            {LINKS.legal.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-background/40 hover:text-background/70 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
