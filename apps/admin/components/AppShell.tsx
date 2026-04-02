"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const CHROMELESS_PATHS = ["/sign-in"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isChromeless) {
    return <main className="min-h-screen bg-sand">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-sand md:flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
