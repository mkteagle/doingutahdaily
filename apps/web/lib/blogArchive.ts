export const STORIES_PER_PAGE = 8;

type RawFilters = Record<string, string | string[] | undefined>;

export interface BlogFilters {
  page: number;
  search: string;
  categories: string[];
}

export function getBlogFilters(params: RawFilters): BlogFilters {
  const pages = Number(typeof params.page === "string" ? params.page : 1);
  const categories = typeof params.categories === "string" ? params.categories.split(",") : [];

  return {
    page: Number.isSafeInteger(pages) && pages > 0 ? pages : 1,
    search: typeof params.search === "string" ? params.search.trim().slice(0, 120) : "",
    categories: [...new Set(categories.map((category) => category.trim()).filter(Boolean))].slice(0, 12),
  };
}

export function blogArchiveUrl(filters: Partial<BlogFilters> = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categories?.length) params.set("categories", filters.categories.join(","));
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params.size ? `/blog?${params}` : "/blog";
}
