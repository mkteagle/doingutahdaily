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

const defaultContext: ThemeContextType = {
  season: themeConfig.defaultSeason,
  setSeason: () => {},
  colorMode: themeConfig.defaultColorMode,
  setColorMode: () => {},
  colors:
    seasonalColors[themeConfig.defaultSeason][themeConfig.defaultColorMode],
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season>(themeConfig.defaultSeason);
  const [colorMode, setColorMode] = useState<ColorMode>(
    themeConfig.defaultColorMode
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as ColorMode | null;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setColorMode(savedTheme || (systemDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = seasonalColors[season][colorMode];

    // // Apply theme CSS variables
    // root.style.setProperty("--primary", colors.primary);
    // root.style.setProperty("--secondary", colors.secondary);
    // root.style.setProperty("--accent", colors.accent);
    // root.style.setProperty("--text", colors.text);

    // Set dark mode class for Tailwind
    root.classList.toggle("dark", colorMode === "dark");
    localStorage.setItem("theme", colorMode);
  }, [season, colorMode, mounted]);

  const contextValue: ThemeContextType = {
    season,
    setSeason,
    colorMode,
    setColorMode,
    colors: seasonalColors[season][colorMode],
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
