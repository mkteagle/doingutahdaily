"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { Season, ColorMode, ColorScheme } from "./types";
import { seasonalColors, themeConfig } from "./config";

interface ThemeContextType {
  season: Season;
  setSeason: (season: Season) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season>(themeConfig.defaultSeason);
  const [colorMode, setColorMode] = useState<ColorMode>(
    themeConfig.defaultColorMode
  );
  const [mounted, setMounted] = useState(false);

  // Effect to detect and set system theme preference
  useEffect(() => {
    setMounted(true);

    // Function to get system theme preference
    const getSystemTheme = (): ColorMode => {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem("theme") as ColorMode | null;
    const systemTheme = getSystemTheme();

    setColorMode(storedTheme || systemTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setColorMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  // Effect to update document theme
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = seasonalColors[season][colorMode];

    // Set dark mode class for Tailwind
    root.classList.toggle("dark", colorMode === "dark");

    // Only store theme if explicitly set (not system default)
    if (localStorage.getItem("theme")) {
      localStorage.setItem("theme", colorMode);
    }
  }, [season, colorMode, mounted]);

  const contextValue = {
    season,
    setSeason,
    colorMode,
    setColorMode,
    colors: seasonalColors[season][colorMode],
  };

  // Prevent flash of wrong theme
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
