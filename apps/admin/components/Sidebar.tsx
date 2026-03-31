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
    <aside className="w-56 min-h-screen bg-cream border-r border-sand flex flex-col">
      <div className="px-5 py-5 border-b border-sand">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-canyon">
          Doing Utah Daily
        </p>
        <p className="text-sm font-semibold text-ink mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-4 overflow-auto">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
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
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
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

      <div className="px-5 py-4 border-t border-sand">
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
