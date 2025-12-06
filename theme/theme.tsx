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

// Helper function to convert HSL string to HSL values for CSS variables
function hslToValues(hsl: string): string {
  // Extract h, s, l from formats like "hsl(339, 89%, 76%)" or "#hex"
  if (hsl.startsWith('#')) {
    // Convert hex to HSL
    const hex = hsl.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } else if (hsl.startsWith('hsl')) {
    // Extract values from "hsl(339, 89%, 76%)"
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      return `${match[1]} ${match[2]}% ${match[3]}%`;
    }
  }

  // Fallback
  return '0 0% 50%';
}

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
    const storedSeason = localStorage.getItem("season") as Season | null;
    const systemTheme = getSystemTheme();

    setColorMode(storedTheme || systemTheme);
    if (storedSeason) {
      setSeason(storedSeason);
    }

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

  // Effect to update document theme and CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = seasonalColors[season][colorMode];

    // Set dark mode class for Tailwind
    root.classList.toggle("dark", colorMode === "dark");

    // Set CSS custom properties for seasonal colors
    root.style.setProperty('--seasonal-primary', hslToValues(colors.primary));
    root.style.setProperty('--seasonal-secondary', hslToValues(colors.secondary));
    root.style.setProperty('--seasonal-accent', hslToValues(colors.accent));

    // Store preferences
    if (localStorage.getItem("theme")) {
      localStorage.setItem("theme", colorMode);
    }
    localStorage.setItem("season", season);
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
