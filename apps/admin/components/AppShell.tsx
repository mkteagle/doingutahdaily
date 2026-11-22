"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar, COLLAPSED_WIDTH } from "@/components/SidebarContext";

function ShellInner({ children, passkeysEnabled }: { children: ReactNode; passkeysEnabled: boolean }) {
  const pathname = usePathname();
  const { isCollapsed, sidebarWidth } = useSidebar();

  if (pathname === "/sign-in") {
    return <main className="min-h-dvh bg-sand">{children}</main>;
  }

  const width = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;
  return (
    <div className="admin-shell" style={{ "--sidebar-width": `${width}px` } as CSSProperties}>
      <Sidebar passkeysEnabled={passkeysEnabled} />
      <main id="admin-content" className="min-w-0">{children}</main>
    </div>
  );
}

export function AppShell({ children, passkeysEnabled }: { children: ReactNode; passkeysEnabled: boolean }) {
  return <SidebarProvider><ShellInner passkeysEnabled={passkeysEnabled}>{children}</ShellInner></SidebarProvider>;
}
