import type { MetadataRoute } from "next";
import { postService } from "@dud/db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await postService.getPublishedPostSummaries();
  const pages = ["", "/activities", "/events", "/blog", "/instagram", "/about", "/contact", "/newsletter"];

  return [
    ...pages.map((path) => ({ url: SITE_URL + path })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
    })),
  ];
}
