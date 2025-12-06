"use client";
import Link from "next/link";
import { useTheme } from "@/theme/theme";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import ThemedLogo from "./ThemedLogo";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const { colorMode } = useTheme();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  const quickLinks = [
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden grain text-white seasonal-gradient">
      {/* Dark overlay for dark mode */}
      {colorMode === "dark" && (
        <div className="absolute inset-0 bg-black/40"></div>
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 diagonal-stripe"></div>
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

      <div className="relative container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <ThemedLogo className="w-48 lg:w-56 h-auto mb-6" />
            <p className="font-serif text-lg lg:text-xl text-white/90 mb-6 max-w-md leading-relaxed">
              Discover Utah&apos;s magic every single day. Your trusted guide to
              family-friendly events and unforgettable adventures across the
              Beehive State.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className="group p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  aria-label={name}
                >
                  <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="font-display text-lg">Stay Updated</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Get weekly event highlights delivered to your inbox
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 text-sm"
                />
                <button className="px-4 py-2 rounded-lg bg-white text-[hsl(var(--primary))] font-bold hover:bg-white/90 transition-colors whitespace-nowrap">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Connect
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60 mb-1">Email</div>
                  <a
                    href="mailto:hello@doingutahdaily.com"
                    className="text-white/90 hover:text-white font-medium transition-colors"
                  >
                    hello@doingutahdaily.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60 mb-1">Location</div>
                  <span className="text-white/90 font-medium">
                    Salt Lake City, Utah
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Doing Utah Daily. All rights reserved.
            Made with <Heart className="w-4 h-4 inline text-red-400" /> in Utah.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/70 hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
