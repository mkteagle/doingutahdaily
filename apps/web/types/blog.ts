// types/blog.ts
export type Category =
  | "Family Activities"
  | "Outdoor Adventures"
  | "Indoor Activities"
  | "Seasonal Events"
  | "Free Events"
  | "Holiday Events"
  | "Food & Dining"
  | "Arts & Culture"
  // New Season Categories
  | "Spring"
  | "Summer"
  | "Fall"
  | "Winter"
  // New Holiday Categories
  | "Easter"
  | "Christmas"
  | "Thanksgiving"
  | "Valentine's Day"
  | "Fourth of July";

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    picture?: string;
  };
  coverImage?: string;
  ogImage?: {
    url: string;
  };
  categories: Category[];
  readingTime?: string;
}

export interface Blog {
  meta: BlogMeta;
  content: any;
}
