const publicSite = "https://www.doingutahdaily.com";

export function isSitePath(value: unknown): value is string {
  return typeof value === "string" && /^\/(?![/\\])/.test(value);
}

export function storyImageUrl(source: string) {
  return isSitePath(source) ? new URL(source, publicSite).href : source;
}

export function isStoryImageUrl(value: string) {
  if (!value || /[\s\\]/.test(value)) return false;
  try {
    const url = new URL(storyImageUrl(value));
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
