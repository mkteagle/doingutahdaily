// theme/types.ts

export type Season = "spring" | "summer" | "fall" | "winter";
export type ColorMode = "light" | "dark";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface SeasonalColorScheme {
  light: ColorScheme;
  dark: ColorScheme;
}

export interface SeasonalColors {
  spring: SeasonalColorScheme;
  summer: SeasonalColorScheme;
  fall: SeasonalColorScheme;
  winter: SeasonalColorScheme;
}

export interface ThemeConfig {
  seasonalColors: SeasonalColors;
  defaultSeason: Season;
  defaultColorMode: ColorMode;
}
