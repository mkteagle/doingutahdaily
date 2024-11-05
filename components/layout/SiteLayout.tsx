"use client";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const { colorMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main
        className={cn(
          "flex-grow",
          colorMode === "dark"
            ? "bg-gray-800/95 backdrop-blur-sm" // Dark mode with the specific style
            : "bg-gray-50", // Light mode stays the same
          "transition-colors duration-200"
        )}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
