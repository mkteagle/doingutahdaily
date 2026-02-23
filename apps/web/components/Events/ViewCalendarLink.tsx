"use client";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { getGoogleCalendarUrl } from "@/utils/categoryHelpers";

export function ViewCalendarLink() {
  const { colorMode, colors } = useTheme();

  const openCalendar = () => {
    window.open(getGoogleCalendarUrl(), "_blank");
  };

  return (
    <Link
      href="#"
      onClick={openCalendar}
      className={cn(
        "flex items-center justify-center gap-2",
        "py-4 my-8",
        "text-lg font-medium",
        "transition-colors duration-200"
      )}
      style={{ color: colors.primary }}
    >
      View Full Calendar
      <Calendar className="w-5 h-5" />
    </Link>
  );
}
