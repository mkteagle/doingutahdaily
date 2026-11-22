import type { Metadata } from "next";
import { SITE_URL } from "./site";

const siteName = "Doing Utah Daily";
const defaultImage = {
  url: new URL("/images/doing-utah-daily-social.jpg", SITE_URL).href,
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: "A mother and child hiking through golden aspens in Utah",
};

type PageMetadata = {
  path: string;
  title: string;
  description: string;
  coverImage?: string | null;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    authors?: string[];
    tags: string[];
  };
};

function featuredImage(source: string | null | undefined, alt: string) {
  if (!source?.trim()) return null;
  try {
    const url = new URL(source, SITE_URL);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return { url: url.href, alt };
  } catch {
    return null;
  }
}

export function pageMetadata({ path, title, description, coverImage, article }: PageMetadata) {
  const url = new URL(path, SITE_URL).href;
  const image = featuredImage(coverImage, title);
  const core = {
    siteName,
    locale: "en_US",
    title,
    description,
    url,
    images: image ? [image, defaultImage] : [defaultImage],
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: article ? { ...core, type: "article", ...article } : { ...core, type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image ?? defaultImage] },
  } satisfies Metadata;
}
