"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar, COLLAPSED_WIDTH } from "@/components/SidebarContext";

type AppShellProps = { children: ReactNode; passkeysEnabled: boolean; adminEmail?: string };

function ShellInner({ children, passkeysEnabled, adminEmail }: AppShellProps) {
  const pathname = usePathname();
  const { isCollapsed, sidebarWidth } = useSidebar();

  if (pathname === "/sign-in") {
    return <main className="min-h-dvh bg-sand">{children}</main>;
  }

  const width = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;
  return (
    <div className="admin-shell" style={{ "--sidebar-width": `${width}px` } as CSSProperties}>
      <Sidebar passkeysEnabled={passkeysEnabled} adminEmail={adminEmail} />
      <main id="admin-content" className="min-w-0">{children}</main>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return <SidebarProvider><ShellInner {...props} /></SidebarProvider>;
}
