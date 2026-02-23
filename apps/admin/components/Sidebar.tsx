"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "⊞" },
  { label: "Posts", href: "/posts", icon: "✎" },
  { label: "Social Feed", href: "/social", icon: "◈" },
  { label: "Events", href: "/events", icon: "◷" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-6 border-b border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Doing Utah Daily
        </p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-200">
        <a
          href="https://doingutahdaily.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ↗ View Site
        </a>
      </div>
    </aside>
  );
}
