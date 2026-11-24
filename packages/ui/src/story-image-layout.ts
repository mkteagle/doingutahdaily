const presetWidths = { small: 320, medium: 480, large: 720 } as const;

export type StoryImageLayout = (
  | { size: keyof typeof presetWidths | "original" }
  | { size: "custom"; width: number }
) & { ratio?: string };

export const originalStoryImageLayout: StoryImageLayout = { size: "original" };
export const maxStoryImageWidth = 4096;

export function parseStoryImageWidth(value: string) {
  if (!/^\d{1,4}$/.test(value)) return undefined;
  const width = Number(value);
  return width > 0 && width <= maxStoryImageWidth ? width : undefined;
}

export function parseStoryImageRatio(value: string) {
  const match = /^(\d{1,4})\s*:\s*(\d{1,4})$/.exec(value.trim());
  if (!match) return undefined;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width && height ? `${width}:${height}` : undefined;
}

export function storyImageWidth(layout: StoryImageLayout) {
  if (layout.size === "original") return undefined;
  return layout.size === "custom" ? layout.width : presetWidths[layout.size];
}

export function storyImageLayoutValue(layout: StoryImageLayout) {
  if (layout.size === "original" && !layout.ratio) return "";
  const size = layout.size === "custom" ? layout.width : layout.size;
  return layout.ratio ? `${size} ${layout.ratio}` : String(size);
}

export function parseStoryImageLayout(value: string): StoryImageLayout | undefined {
  const [size, ratioText, extra] = value.split(" ");
  const ratio = ratioText ? parseStoryImageRatio(ratioText) : undefined;
  if (extra !== undefined || (ratioText !== undefined && !ratio)) return undefined;
  if (size === "original" || size === "small" || size === "medium" || size === "large") return { size, ratio };
  const width = parseStoryImageWidth(size);
  return width ? { size: "custom", width, ratio } : undefined;
}

// Keep sized photos as Markdown images so they still render in other Markdown clients.
// The optional title carries the layout, after any existing human-readable title.
export function storyImageTitle(title: string, layout: StoryImageLayout) {
  const value = storyImageLayoutValue(layout);
  return value ? `${title ? title + " " : ""}[story-image: ${value}]` : title;
}

export function readStoryImageTitle(title: string) {
  const marker = /(?:^| )\[story-image: ([^\]]+)\]$/.exec(title);
  const layout = marker ? parseStoryImageLayout(marker[1]) : undefined;
  return { title: marker && layout ? title.slice(0, marker.index) : title, layout };
}

export function storyImageStyle(layout: StoryImageLayout) {
  const width = storyImageWidth(layout);
  const ratio = layout.ratio?.replace(":", "/");
  return [
    width ? `width: ${width}px` : "",
    ratio ? `aspect-ratio: ${ratio}; object-fit: cover` : "",
  ].filter(Boolean).join("; ");
}
