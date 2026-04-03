"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar, COLLAPSED_WIDTH } from "@/components/SidebarContext";

const CHROMELESS_PATHS = ["/sign-in"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, sidebarWidth } = useSidebar();
  const isChromeless = CHROMELESS_PATHS.some((path) => pathname.startsWith(path));

  if (isChromeless) {
    return <main className="min-h-screen bg-sand">{children}</main>;
  }

  const ml = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

  return (
    <div className="min-h-screen bg-sand">
      <Sidebar />
      <main
        className="hidden md:block min-h-screen transition-[margin-left] duration-200"
        style={{ marginLeft: ml }}
      >
        {children}
      </main>
      {/* Mobile: no sidebar offset */}
      <main className="md:hidden min-h-screen">{children}</main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  );
}
