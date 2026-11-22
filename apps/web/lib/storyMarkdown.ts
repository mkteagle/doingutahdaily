import remarkGfm from "remark-gfm";

export function storyMarkdownOptions(source: string) {
  // Imported stories can contain HTML or JSX, while new stories use Markdown.
  const legacyMarkup = /<\/?[a-z][\w.-]*(?=[\s/>])[^>]*>/i.test(source);
  return {
    format: legacyMarkup ? "mdx" as const : "md" as const,
    remarkPlugins: [remarkGfm],
  };
}
