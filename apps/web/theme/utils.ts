export function hslToColor(hsl: string): string {
  return `hsl(${hsl})`;
}

// Get readable color value from HSL string
export function getReadableColor(hsl: string): string {
  return `hsl(${hsl})`;
}

// Convert HSL theme variable to CSS custom property
export function cssVar(name: string): string {
  return `var(${name})`;
}
