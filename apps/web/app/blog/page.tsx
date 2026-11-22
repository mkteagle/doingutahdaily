import { notFound } from "next/navigation";
import { postService } from "@dud/db";
import type { Metadata } from "next";
import BlogList from "@/components/screens/BlogList";
import { blogArchiveUrl, getBlogFilters, STORIES_PER_PAGE } from "@/lib/blogArchive";
import { pageMetadata } from "@/lib/pageMetadata";

type BlogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const title = "Utah Stories & Family Guides";
const description = "Discover family outings, seasonal adventures, and first-hand reviews of things to do in Utah.";

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { page, search, categories } = getBlogFilters(await searchParams);
  const parameterized = Boolean(search || categories.length);
  const canonical = blogArchiveUrl({ page: parameterized ? 1 : page });

  return {
    ...pageMetadata({ path: canonical, title: page > 1 ? `${title} – Page ${page}` : title, description }),
    robots: parameterized ? { index: false, follow: true } : undefined,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, search] = await Promise.all([postService.getPublishedPostSummaries(), searchParams]);
  const filters = getBlogFilters(search);
  const categories = [...new Set(posts.flatMap((post) => post.categories.map(({ name }) => name)))].sort();
  const query = filters.search.toLowerCase();
  const matches = posts.filter((post) =>
    (!query || [post.title, post.excerpt, ...post.categories.map(({ name }) => name)]
      .some((text) => text?.toLowerCase().includes(query))) &&
    (!filters.categories.length || post.categories.some(({ name }) => filters.categories.includes(name)))
  );
  const pages = Math.max(1, Math.ceil(matches.length / STORIES_PER_PAGE));
  if (filters.page > pages) notFound();
  const start = (filters.page - 1) * STORIES_PER_PAGE;

  return (
    <BlogList
      posts={matches.slice(start, start + STORIES_PER_PAGE)}
      categories={categories}
      filters={filters}
      pages={pages}
      count={matches.length}
    />
  );
}
