/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!DOCTYPE html>");
const document = window.document;

// Type Definitions
type Category =
  | "Family Activities"
  | "Outdoor Adventures"
  | "Indoor Activities"
  | "Seasonal Events"
  | "Free Events"
  | "Holiday Events"
  | "Food & Dining"
  | "Arts & Culture";

// Constants
const CATEGORIES = [
  "Family Activities",
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Free Events",
  "Holiday Events",
  "Food & Dining",
  "Arts & Culture",
] as const;

const COUNTY_TO_CATEGORIES: Record<string, Category[]> = {
  "Salt Lake": ["Family Activities", "Indoor Activities"],
  Utah: ["Family Activities", "Indoor Activities"],
  Davis: ["Family Activities", "Indoor Activities"],
  Cache: ["Family Activities", "Seasonal Events"],
  Iron: ["Family Activities", "Outdoor Adventures"],
  Tooele: ["Family Activities", "Outdoor Adventures"],
};

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "Family Activities": ["family", "kids", "children", "activities", "fun"],
  "Outdoor Adventures": ["outdoor", "hiking", "mountain", "trail", "adventure"],
  "Indoor Activities": ["indoor", "museum", "inside"],
  "Seasonal Events": [
    "season",
    "seasonal",
    "spring",
    "summer",
    "fall",
    "winter",
  ],
  "Free Events": ["free", "no cost"],
  "Holiday Events": ["christmas", "holiday", "easter", "halloween"],
  "Food & Dining": ["food", "restaurant", "dining", "eat"],
  "Arts & Culture": ["art", "culture", "museum", "history", "gallery"],
};

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      Node: typeof window.Node;
      HTMLElement: typeof window.HTMLElement;
      Element: typeof window.Element;
      DocumentFragment: typeof window.DocumentFragment;
    }
  }
}

(global as any).document = document;
(global as any).Node = window.Node;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).DocumentFragment = window.DocumentFragment;

interface Post {
  title: string;
  param: string;
  content: string;
  featured: boolean;
  published: boolean;
  created: number;
  author: string;
  county: string;
}

interface PostsData {
  posts: Post[];
}

function detectCategories(post: Post): Category[] {
  const categories = new Set<Category>();

  // Add categories based on county
  const countyCategories = COUNTY_TO_CATEGORIES[post.county] || [];
  countyCategories.forEach((category) => {
    if (CATEGORIES.includes(category)) {
      categories.add(category);
    }
  });

  // Content-based detection
  const lowerContent = (post.content + post.title).toLowerCase();

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    if (
      CATEGORIES.includes(category as Category) &&
      keywords.some((keyword) => lowerContent.includes(keyword))
    ) {
      categories.add(category as Category);
    }
  });

  return Array.from(categories);
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndownService.addRule("imgCentered", {
  filter: function (node: Node): boolean {
    if (!(node instanceof global.HTMLElement)) {
      return false;
    }
    return (
      node.nodeName === "IMG" &&
      node.parentElement !== null &&
      node.parentElement.className?.includes("aligncenter")
    );
  },
  replacement: function (content: string, node: Node): string {
    if (!(node instanceof global.HTMLElement)) {
      return "";
    }
    const src = node.getAttribute("src") || "";
    const alt = node.getAttribute("alt") || "";
    return `\n\n<ImageGrid images={[{ src: "${src}", alt: "${alt}" }]} columns={1} />\n\n`;
  },
});

turndownService.addRule("wordPressEmbed", {
  filter: function (node: Node): boolean {
    if (!(node instanceof global.HTMLElement)) {
      return false;
    }
    return node.nodeName === "P" && node.innerHTML.includes("[embed]");
  },
  replacement: function (): string {
    return "";
  },
});

async function convertPostsToMDX(jsonPath: string, outputDir: string) {
  try {
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(jsonContent) as PostsData;

    await fs.mkdir(outputDir, { recursive: true });

    for (const post of data.posts) {
      if (!post.published) continue;

      try {
        let mdContent = turndownService.turndown(post.content);

        mdContent = mdContent
          .replace(/\[embed\].*?\[\/embed\]/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .replace(/\]\(http:\/\//g, "](https://")
          .trim();

        const date = new Date(post.created).toISOString();
        const categories = detectCategories(post);

        const excerpt =
          mdContent
            .replace(/[#*\[\]`]/g, "")
            .slice(0, 150)
            .trim()
            .replace(/"/g, '\\"') + "...";

        const categoryString =
          categories.length > 0
            ? categories.map((cat) => `"${cat}"`).join(", ")
            : "";

        const mdxContent = `---
title: "${post.title.replace(/"/g, '\\"')}"
excerpt: "${excerpt}"
date: "${date}"
categories: [${categoryString}]
author:
  name: "Doing Utah Daily"
  picture: "/assets/authors/jjmemoji.png"
coverImage: "/assets/blog/${post.param}/cover.jpg"
ogImage:
  url: "/assets/blog/${post.param}/cover.jpg"
---

${mdContent}`;

        const filePath = path.join(outputDir, `${post.param}.mdx`);
        await fs.writeFile(filePath, mdxContent);

        console.log(`Created: ${filePath} with categories:`, categories);
      } catch (error) {
        console.error(`Error processing post "${post.title}":`, error);
      }
    }

    console.log("Conversion complete!");
  } catch (error) {
    console.error("Error converting posts:", error);
    throw error;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.resolve(__dirname, "../paste.txt");
const outputDir = path.resolve(__dirname, "../content/blog");

convertPostsToMDX(inputPath, outputDir).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
