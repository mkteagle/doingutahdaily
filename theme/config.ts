// theme/config.ts
import type { SeasonalColors, ThemeConfig } from "./types";

export const seasonalColors: SeasonalColors = {
  spring: {
    light: {
      primary: "hsl(339, 89%, 76%)",
      secondary: "hsl(144, 37%, 71%)",
      accent: "#fff1e6",
      background: "from-pink-100 to-green-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(339, 89%, 66%)",
      secondary: "hsl(144, 37%, 61%)",
      accent: "#1a202c",
      background: "from-pink-950 to-green-950",
      text: "#f7fafc",
    },
  },
  summer: {
    light: {
      primary: "hsl(150, 59%, 51%)",
      secondary: "hsl(210, 75%, 60%)",
      accent: "#faf089",
      background: "from-green-100 to-blue-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(150, 59%, 41%)",
      secondary: "hsl(210, 75%, 50%)",
      accent: "#1a202c",
      background: "from-green-950 to-blue-950",
      text: "#f7fafc",
    },
  },
  fall: {
    light: {
      primary: "hsl(25, 85%, 57%)",
      secondary: "hsl(273, 68%, 59%)",
      accent: "#fed7d7",
      background: "from-orange-100 to-purple-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(25, 85%, 47%)",
      secondary: "hsl(273, 68%, 49%)",
      accent: "#1a202c",
      background: "from-orange-950 to-purple-950",
      text: "#f7fafc",
    },
  },
  winter: {
    light: {
      primary: "hsl(206, 85%, 66%)",
      secondary: "hsl(270, 67%, 63%)",
      accent: "#e2e8f0",
      background: "from-blue-100 to-indigo-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(206, 85%, 56%)",
      secondary: "hsl(270, 67%, 53%)",
      accent: "#1a202c",
      background: "from-blue-950 to-indigo-950",
      text: "#f7fafc",
    },
  },
};

export const themeConfig: ThemeConfig = {
  seasonalColors,
  defaultSeason: "fall",
  defaultColorMode: "light",
};
