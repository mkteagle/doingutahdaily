import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { MountainMark } from "@dud/ui/mountain-mark";
import { INSTAGRAM_URL } from "@/lib/social";

const explore = [
  { label: "Activities", href: "/activities" },
  { label: "Events", href: "/events" },
  { label: "Stories & Guides", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Share an event", href: "/submit" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#23392a] text-[#fbf1e4]">
      <div className="field-container pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold">
              <MountainMark className="w-14 text-[#e9a181]" /> Doing Utah Daily
            </Link>
            <p className="mt-4 max-w-sm text-[#e0dfd3]">
              Things to do in Utah with kids, shared by a local family.
            </p>
          </div>
          <nav aria-label="Explore" className="grid content-start justify-items-start gap-2">
            {explore.map(({ label, href }) => (
              <Link key={href} href={href} className="hover:underline">{label}</Link>
            ))}
          </nav>
          <div className="grid content-start justify-items-start gap-3">
            <Link href="/contact" className="hover:underline">Partner with us</Link>
            <Link href="/newsletter" className="hover:underline">Newsletter signup</Link>
            <a href={INSTAGRAM_URL} className="flex items-center gap-2 hover:underline">
              <Instagram size={16} aria-hidden /> Instagram
            </a>
            <a href="mailto:hello@doingutahdaily.com" className="flex items-center gap-2 break-all hover:underline">
              <Mail size={16} aria-hidden /> hello@doingutahdaily.com
            </a>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-white/20 py-5 text-sm text-[#e0dfd3]">
          <span>© {new Date().getFullYear()} Doing Utah Daily</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
