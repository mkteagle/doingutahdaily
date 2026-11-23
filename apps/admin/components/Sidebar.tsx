"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck, BookOpen, Calendar, ExternalLink, FileText, Inbox, Instagram, LayoutDashboard,
  LogOut, MapPin, Menu, KeyRound, PanelLeftClose, PanelLeftOpen, Sparkles, Users, X,
} from "lucide-react";
import { MountainMark } from "@dud/ui/mountain-mark";
import { useSidebar, MIN_WIDTH, MAX_WIDTH } from "@/components/SidebarContext";

const groups = [
  {
    label: "Publishing",
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard },
      { label: "Stories", href: "/posts", icon: FileText },
      { label: "Quick capture", href: "/capture", icon: Sparkles },
      { label: "ChatGPT guide", href: "/help/chatgpt", icon: BookOpen },
    ],
  },
  {
    label: "Utah guide",
    items: [
      { label: "Activities", href: "/activities", icon: MapPin },
      { label: "Events", href: "/events", icon: Calendar },
      { label: "Submissions", href: "/submissions", icon: Inbox },
      { label: "Verification", href: "/verification", icon: BadgeCheck },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Newsletter", href: "/subscribers", icon: Users },
      { label: "Social feed", href: "/social", icon: Instagram },
    ],
  },
];

export function Sidebar({ passkeysEnabled, adminEmail }: { passkeysEnabled: boolean; adminEmail?: string }) {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, sidebarWidth, setSidebarWidth } = useSidebar();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const mobileOpen = openPath === pathname;

  function resize(width: number) {
    const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
    setSidebarWidth(next);
    localStorage.setItem("dud-admin-sidebar-width", String(next));
  }

  useEffect(() => {
    const stored = localStorage.getItem("dud-admin-sidebar-width");
    const width = stored ? Number(stored) : NaN;
    if (Number.isFinite(width)) setSidebarWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width)));
  }, [setSidebarWidth]);

  function closeMenu() {
    setOpenPath(null);
    mobileToggle.current?.focus();
  }

  return (
    <header className="bg-[#263d2f] text-[#f9f3e8] md:sticky md:top-0 md:h-dvh">
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-white/15 px-5 md:hidden">
        <Link href="/" onClick={() => setOpenPath(null)} className="flex items-center gap-2 font-semibold">
          <MountainMark className="w-11 text-[#eda484]" /> Doing Utah Daily
        </Link>
        <button ref={mobileToggle} type="button" className="grid size-10 place-items-center rounded-lg hover:bg-white/10"
          aria-label={mobileOpen ? "Close admin navigation" : "Open admin navigation"} aria-expanded={mobileOpen}
          aria-controls="admin-navigation" onClick={() => setOpenPath(mobileOpen ? null : pathname)}>
          {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>

      <aside id="admin-navigation" className={`${mobileOpen ? "flex" : "hidden"} min-h-0 flex-col md:flex md:h-full`}
        onKeyDown={(event) => { if (event.key === "Escape" && mobileOpen) closeMenu(); }}>
        <div className={`hidden min-h-[4.75rem] items-center gap-2 border-b border-white/15 md:flex ${isCollapsed ? "justify-center" : "px-4"}`}>
          {isCollapsed ? (
            <button type="button" onClick={() => setIsCollapsed(false)} className="grid size-10 place-items-center rounded-lg hover:bg-white/10" aria-label="Expand sidebar">
              <PanelLeftOpen size={19} aria-hidden />
            </button>
          ) : (
            <>
              <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
                <MountainMark className="w-9 shrink-0 text-[#eda484]" />
                <span className="truncate">Doing Utah Daily</span>
              </Link>
              <button type="button" onClick={() => setIsCollapsed(true)} className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-white/10" aria-label="Collapse sidebar">
                <PanelLeftClose size={16} aria-hidden />
              </button>
            </>
          )}
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className={`px-2 pb-1 text-xs font-semibold text-white/65 ${isCollapsed ? "md:sr-only" : ""}`}>{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link href={href} title={label} onClick={() => setOpenPath(null)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm hover:bg-white/10 aria-[current=page]:bg-white/15 aria-[current=page]:font-semibold ${isCollapsed ? "md:justify-center md:px-0" : ""}`}>
                        <Icon size={17} className="shrink-0 text-[#e9b59e]" aria-hidden />
                        <span className={isCollapsed ? "md:sr-only" : ""}>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/15 px-3 py-3">
          {adminEmail && <p className={`truncate px-2 pb-2 text-xs text-white/65 ${isCollapsed ? "md:sr-only" : ""}`}>{adminEmail}</p>}
          {passkeysEnabled && (
            <Link href="/account" onClick={() => setOpenPath(null)} title="Account security"
              className="mb-2 flex min-h-9 items-center gap-2 rounded-md px-2 text-xs hover:bg-white/10">
              <KeyRound size={14} aria-hidden /> <span className={isCollapsed ? "md:sr-only" : ""}>Account security</span>
            </Link>
          )}
          <div className={`flex gap-1 ${isCollapsed ? "md:flex-col" : "flex-wrap"}`}>
            <a className="flex min-h-9 items-center gap-2 rounded-md px-2 text-xs hover:bg-white/10" href="https://www.doingutahdaily.com/" title="View live site">
              <ExternalLink size={14} aria-hidden /> <span className={isCollapsed ? "md:sr-only" : ""}>View live site</span>
            </a>
            <button type="button" className="flex min-h-9 items-center gap-2 rounded-md px-2 text-xs hover:bg-white/10"
              title="Sign out" onClick={() => void authClient.signOut({ fetchOptions: { onSuccess: () => window.location.assign("/sign-in") } })}>
              <LogOut size={14} aria-hidden /> <span className={isCollapsed ? "md:sr-only" : ""}>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
      {!isCollapsed && (
        <div
          role="separator" tabIndex={0} aria-label="Resize sidebar" aria-orientation="vertical"
          aria-valuemin={MIN_WIDTH} aria-valuemax={MAX_WIDTH} aria-valuenow={sidebarWidth}
          className="absolute inset-y-0 right-0 hidden w-1.5 cursor-col-resize hover:bg-white/25 focus-visible:bg-white/25 md:block"
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            resize(sidebarWidth + (event.key === "ArrowRight" ? 10 : -10));
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) resize(event.clientX);
          }}
        />
      )}
    </header>
  );
}
