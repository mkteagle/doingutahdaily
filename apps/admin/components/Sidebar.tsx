"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { signOut } from "next-auth/react";
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
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import {
  useSidebar,
  MIN_WIDTH,
  MAX_WIDTH,
  COLLAPSED_WIDTH,
} from "@/components/SidebarContext";

const navGroups = [
  {
    label: "Dashboard",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Capture", href: "/capture", icon: Sparkles },
      { label: "Posts", href: "/posts", icon: FileText },
      { label: "Activities", href: "/activities", icon: MapPin },
      { label: "Events", href: "/events", icon: Calendar },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { label: "Submissions", href: "/submissions", icon: Inbox },
      { label: "Verification", href: "/verification", icon: BadgeCheck },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Subscribers", href: "/subscribers", icon: Users },
      { label: "Social Feed", href: "/social", icon: Instagram },
    ],
  },
];

function DudMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
      <circle cx="20" cy="13" r="5" fill="#C45C2A" opacity="0.9" />
      <path d="M5 33 L14 18 L20 27 L26 20 L35 33 Z" fill="#C45C2A" opacity="0.7" />
      <path d="M14 18 L20 27 L26 20 L20 14 Z" fill="#C45C2A" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isCollapsed, setIsCollapsed, sidebarWidth, setSidebarWidth } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
      setSidebarWidth(newWidth);
      localStorage.setItem("dud-admin-sidebar-width", String(newWidth));
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  useEffect(() => {
    const saved = localStorage.getItem("dud-admin-sidebar-width");
    if (saved) setSidebarWidth(Number(saved));
  }, [setSidebarWidth]);

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

  return (
    <aside
      ref={sidebarRef}
      className="fixed top-0 left-0 h-full z-40 hidden md:flex flex-col bg-cream border-r border-sand select-none"
      style={{
        width: currentWidth,
        transition: isResizing ? "none" : "width 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Brand header */}
      <div
        className={`flex items-center border-b border-sand ${
          isCollapsed ? "px-0 py-4 justify-center" : "px-4 py-4 gap-2.5"
        }`}
      >
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors hover:bg-sand group"
            aria-label="Expand sidebar"
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
          >
            <div
              className={`transition-all duration-200 ${
                isHeaderHovered ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <DudMark size={24} />
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                isHeaderHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <PanelLeftOpen className="h-4 w-4 text-ink/50" />
            </div>
          </button>
        ) : (
          <>
            <div className="flex items-center justify-center w-9 h-9 shrink-0">
              <DudMark size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-canyon leading-tight truncate">
                Doing Utah Daily
              </p>
              <p className="text-[11px] font-medium text-ink/40 leading-tight">Admin</p>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex items-center justify-center w-7 h-7 rounded-md text-ink/30 hover:text-ink hover:bg-sand transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-1.5 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? "mt-4" : ""}>
            {!isCollapsed && (
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">
                {group.label}
              </p>
            )}
            {isCollapsed && gi > 0 && (
              <div className="h-px bg-sand mx-2 my-2" />
            )}
            <div className="space-y-px">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 rounded-lg text-[13px] transition-all duration-100 relative ${
                        active
                          ? "text-canyon font-medium bg-canyon/10"
                          : "text-ink/55 hover:text-ink hover:bg-sand"
                      } ${isCollapsed ? "justify-center px-2 py-2" : "px-2.5 py-[7px]"}`}
                    >
                      {active && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-canyon" />
                      )}
                      {active && isCollapsed && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-t-full bg-canyon" />
                      )}
                      <Icon
                        className={`shrink-0 h-4 w-4 ${active ? "text-canyon" : "text-ink/40"}`}
                        strokeWidth={active ? 2 : 1.5}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-ink text-cream text-[11px] font-medium rounded-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-sand ${isCollapsed ? "px-2 py-3" : "px-4 py-4"}`}>
        {!isCollapsed ? (
          <div className="space-y-3">
            {session?.user?.email && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/30 mb-0.5">
                  Signed in
                </p>
                <p className="text-xs font-medium text-ink truncate">
                  {session.user.email}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-canyon transition-colors"
              >
                <LogOut size={12} />
                Sign out
              </button>
              <a
                href="https://doingutahdaily.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-ink/30 hover:text-canyon transition-colors"
              >
                <ExternalLink size={11} />
                View site
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-ink/35 hover:text-canyon hover:bg-sand transition-colors"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Resize handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-[5px] h-full cursor-col-resize group/resize z-50"
          onMouseDown={handleMouseDown}
        >
          <div
            className={`absolute right-0 top-0 w-[1px] h-full transition-all duration-150 ${
              isResizing
                ? "bg-canyon w-[2px]"
                : "bg-transparent group-hover/resize:bg-canyon/40"
            }`}
          />
        </div>
      )}
    </aside>
  );
}
