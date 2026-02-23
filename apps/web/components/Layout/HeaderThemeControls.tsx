"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "@/theme/theme";
import type { Season } from "@/theme/types";
import { cn } from "@/lib/utils";

export function HeaderThemeControls() {
  const { season, setSeason, colorMode, setColorMode, colors } = useTheme();
  const seasons: Season[] = ["spring", "summer", "fall", "winter"];

  const buttonClasses = cn(
    "w-10 h-10 rounded-full",
    "transition-all duration-200",
    colorMode === "dark"
      ? "bg-gray-800 text-gray-200"
      : "bg-gray-100 text-gray-700",
    "border",
    colorMode === "dark" ? "border-gray-700" : "border-gray-200",
    "hover:scale-105"
  );

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <Palette className="h-5 w-5" style={{ color: colors.primary }} />
            <span className="sr-only">Change season</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            "w-32 p-1",
            colorMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}
        >
          {seasons.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => setSeason(s)}
              className={cn(
                "capitalize rounded-md",
                "transition-colors duration-150",
                colorMode === "dark" ? "text-gray-200" : "text-gray-700",
                season === s && "font-medium"
              )}
              style={season === s ? { color: colors.primary } : undefined}
            >
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
        className={buttonClasses}
      >
        {colorMode === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
