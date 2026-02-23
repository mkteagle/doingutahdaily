// theme/config.ts
import type { SeasonalColors, ThemeConfig } from "./types";

export const seasonalColors: SeasonalColors = {
  spring: {
    light: {
      primary: "hsl(339, 89%, 76%)", // Pink
      secondary: "hsl(144, 37%, 71%)", // Mint Green
      accent: "hsl(45, 100%, 85%)", // Soft Yellow
      background: "from-pink-100 to-green-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(339, 75%, 65%)", // Vibrant Pink
      secondary: "hsl(144, 45%, 55%)", // Bright Green
      accent: "hsl(45, 100%, 75%)", // Golden Yellow
      background: "from-pink-950 to-green-950",
      text: "#f7fafc",
    },
  },
  summer: {
    light: {
      primary: "hsl(150, 59%, 51%)", // Teal Green
      secondary: "hsl(210, 75%, 60%)", // Sky Blue
      accent: "hsl(45, 100%, 70%)", // Sunny Yellow
      background: "from-green-100 to-blue-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(150, 65%, 50%)", // Bright Teal
      secondary: "hsl(210, 80%, 60%)", // Ocean Blue
      accent: "hsl(35, 100%, 60%)", // Warm Orange
      background: "from-green-950 to-blue-950",
      text: "#f7fafc",
    },
  },
  fall: {
    light: {
      primary: "hsl(25, 85%, 57%)", // Burnt Orange
      secondary: "hsl(273, 68%, 59%)", // Purple
      accent: "hsl(15, 100%, 70%)", // Coral
      background: "from-orange-100 to-purple-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(25, 90%, 60%)", // Bright Orange
      secondary: "hsl(273, 70%, 65%)", // Vivid Purple
      accent: "hsl(15, 100%, 65%)", // Warm Coral
      background: "from-orange-950 to-purple-950",
      text: "#f7fafc",
    },
  },
  winter: {
    light: {
      primary: "hsl(206, 85%, 66%)", // Ice Blue
      secondary: "hsl(270, 67%, 63%)", // Lavender
      accent: "hsl(190, 70%, 75%)", // Frost
      background: "from-blue-100 to-indigo-100",
      text: "#2d3748",
    },
    dark: {
      primary: "hsl(206, 80%, 65%)", // Bright Ice Blue
      secondary: "hsl(270, 75%, 70%)", // Bright Lavender
      accent: "hsl(190, 70%, 70%)", // Cyan
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
