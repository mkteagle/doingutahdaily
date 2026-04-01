"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Inbox,
  Users,
  Calendar,
  Instagram,
  ExternalLink,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const navSections = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Capture", href: "/capture", icon: Sparkles },
      { label: "Posts", href: "/posts", icon: FileText },
      { label: "Activities", href: "/activities", icon: MapPin },
      { label: "Events", href: "/events", icon: Calendar },
    ],
  },
  {
    title: "Pipeline",
    items: [
      { label: "Submissions", href: "/submissions", icon: Inbox },
      { label: "Verification", href: "/verification", icon: BadgeCheck },
    ],
  },
  {
    title: "Audience",
    items: [
      { label: "Subscribers", href: "/subscribers", icon: Users },
      { label: "Social Feed", href: "/social", icon: Instagram },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-sand bg-cream md:min-h-screen md:w-56 md:border-b-0 md:border-r md:flex md:flex-col">
      <div className="px-5 py-5 border-b border-sand">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-canyon">
          Doing Utah Daily
        </p>
        <p className="text-sm font-semibold text-ink mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 overflow-auto px-3 py-3 md:space-y-4">
        {navSections.map((section, i) => (
          <div key={i} className="mb-3 md:mb-0">
            {section.title && (
              <p className="mb-1.5 hidden px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40 md:block">
                {section.title}
              </p>
            )}
            <div className="flex gap-1 overflow-x-auto pb-1 md:block md:space-y-0.5 md:overflow-visible md:pb-0">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-canyon/10 text-canyon font-medium"
                        : "text-ink/60 hover:bg-sand hover:text-ink"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-canyon" : "text-ink/40"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="hidden border-t border-sand px-5 py-4 md:block">
        <a
          href="https://doingutahdaily.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-canyon transition-colors"
        >
          <ExternalLink size={12} />
          View Site
        </a>
      </div>
    </aside>
  );
}
