"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/theme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroButtons() {
  const { colors } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={cn("flex gap-4 mt-8", isMobile ? "flex-col" : "flex-row")}>
      <Link href="/events">
        <Button
          size="lg"
          className={cn(
            "font-medium text-white",
            isMobile ? "w-full px-6 py-3 text-base" : "px-12 py-6 text-xl",
            "hover:opacity-90 transition-opacity"
          )}
          style={{ backgroundColor: colors.primary }}
        >
          Explore Events
        </Button>
      </Link>

      <Link href="/blog">
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "font-medium border-2",
            isMobile ? "w-full px-6 py-3 text-base" : "px-12 py-6 text-xl",
            "hover:bg-white/10"
          )}
          style={{
            color: colors.primary,
            borderColor: colors.primary,
          }}
        >
          Plan Your Adventure
        </Button>
      </Link>
    </div>
  );
}
