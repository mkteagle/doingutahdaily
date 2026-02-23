"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { Season } from "@/theme/types";

export function ThemeControls() {
  const { season, setSeason, colorMode, setColorMode } = useTheme();
  const seasons: Season[] = ["spring", "summer", "fall", "winter"];

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      {/* Color Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
        className="rounded-full bg-background/80 backdrop-blur-sm"
      >
        {colorMode === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {/* Season Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full bg-background/80 backdrop-blur-sm gap-2"
          >
            <Palette className="h-5 w-5" />
            <span className="capitalize">{season}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Season</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {seasons.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => setSeason(s)}
              className="capitalize"
            >
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
