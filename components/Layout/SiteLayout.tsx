"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SiteHeader } from "@/components/Layout/SiteHeader";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";
import { SiteFooter } from "@/components/Layout/SiteFooter";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { colorMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col relative">
      {isMobile ? <MobileNavigation /> : <SiteHeader />}

      <main
        className={cn(
          "flex-grow",
          colorMode === "dark"
            ? "bg-gray-800/95 backdrop-blur-sm"
            : "bg-gray-50",
          "transition-colors duration-200",
          "relative z-0",
          isMobile && "mb-20"
        )}
      >
        {children}
      </main>

      {!isMobile && <SiteFooter />}
    </div>
  );
}
