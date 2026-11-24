import { readStoryImageTitle, storyImageStyle } from "@dud/ui/story-image-layout";
import remarkGfm from "remark-gfm";

type MarkdownNode = {
  type: string;
  title?: string | null;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
};

function renderStoryImageLayouts() {
  return (tree: MarkdownNode) => {
    function visit(node: MarkdownNode) {
      if (node.type === "image" && node.title) {
        const { title, layout } = readStoryImageTitle(node.title);
        if (layout) {
          node.title = title || null;
          node.data ??= {};
          node.data.hProperties = { ...node.data.hProperties, style: storyImageStyle(layout) };
        }
      }
      node.children?.forEach(visit);
    }

    visit(tree);
  };
}

export function storyMarkdownOptions(source: string) {
  // Imported stories can contain HTML or JSX, while new stories use Markdown.
  const legacyMarkup = /<\/?[a-z][\w.-]*(?=[\s/>])[^>]*>/i.test(source);
  return {
    format: legacyMarkup ? "mdx" as const : "md" as const,
    remarkPlugins: [remarkGfm, renderStoryImageLayouts],
  };
}
