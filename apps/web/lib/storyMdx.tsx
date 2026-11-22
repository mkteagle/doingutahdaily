import { compileMDX } from "next-mdx-remote/rsc";
import JSON5 from "json5";
import { ImageGrid } from "@/components/Blog/ImageGrid";
import { PricingTable } from "@/components/Blog/PricingTable";
import { CalloutBox } from "@/components/Blog/CalloutBox";
import { Paragraph } from "@/components/ui/typography";

interface MdxNode {
  type: string;
  value?: string;
  name?: string;
  depth?: number;
  children?: MdxNode[];
  data?: { hProperties?: Record<string, string> };
  attributes?: { type: string; name?: string; value?: string | { value?: string } | null }[];
}

interface HeadingLink {
  id: string;
  label: string;
}

function textOf(node: MdxNode): string {
  return node.value ?? node.children?.map(textOf).join("") ?? "";
}

function preserveStoryMarkup(headings: HeadingLink[]) {
  return () => (tree: MdxNode) => {
    const ids = new Set<string>();

    function visit(node: MdxNode) {
      const heading = node.type === "heading" || /^H[1-4]$/.test(node.name ?? "");
      if (heading) {
        const label = textOf(node).trim();
        const base = label.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
        if (base) {
          let id = base;
          for (let suffix = 2; ids.has(id); suffix++) id = `${base}-${suffix}`;
          ids.add(id);
          if (node.type === "heading") {
            node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
          } else {
            node.attributes = [...(node.attributes ?? []).filter((attribute) => attribute.name !== "id"), { type: "mdxJsxAttribute", name: "id", value: id }];
          }
          headings.push({ id, label });
        }
      }

      // Recover old static arrays while the MDX compiler continues to block expressions.
      const field = node.name === "ImageGrid" ? "images" : node.name === "PricingTable" ? "items" : null;
      for (const attribute of node.attributes ?? []) {
        if (!attribute.value || typeof attribute.value === "string") continue;
        const isColumns = node.name === "ImageGrid" && attribute.name === "columns";
        if (attribute.name !== field && !isColumns) continue;
        try {
          const parsed: unknown = JSON5.parse(attribute.value.value ?? "");
          if (isColumns ? [2, 3, 4].includes(parsed as number) : Array.isArray(parsed)) {
            attribute.value = JSON.stringify(parsed);
          }
        } catch {
          // Nonliteral values are stripped by the compiler.
        }
      }
      node.children?.forEach(visit);
    }

    visit(tree);
  };
}

function objectList(value?: string) {
  try {
    const items: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(items) ? items.filter((item): item is Record<string, unknown> => item && typeof item === "object" && !Array.isArray(item)) : [];
  } catch {
    return [];
  }
}

function ArticleImages({ images, columns }: { images?: string; columns?: string }) {
  const gallery = objectList(images).flatMap((image) =>
    typeof image.src === "string" && (/^\/(?!\/)/.test(image.src) || image.src.startsWith("https://"))
      ? [{ src: image.src, alt: typeof image.alt === "string" ? image.alt : "" }]
      : [],
  );

  if (!gallery.length) return null;
  return <ImageGrid images={gallery} columns={columns === "3" ? 3 : columns === "4" ? 4 : 2} />;
}

function ArticlePricing({ items }: { items?: string }) {
  const prices = objectList(items).flatMap((item) =>
    typeof item.name === "string" && typeof item.price === "string"
      ? [{ name: item.name, price: item.price, description: typeof item.description === "string" ? item.description : undefined }]
      : [],
  );

  return prices.length ? <PricingTable items={prices} /> : null;
}

export async function compileStoryMdx(source: string) {
  const headings: HeadingLink[] = [];
  const { content } = await compileMDX({
    source,
    options: { mdxOptions: { remarkPlugins: [preserveStoryMarkup(headings)] } },
    components: {
      h1: "h2",
      H1: "h2",
      H2: "h2",
      H3: "h3",
      H4: "h4",
      Paragraph,
      InlineLink: "a",
      ImageGrid: ArticleImages,
      PricingTable: ArticlePricing,
      CalloutBox,
    },
  });

  return { content, headings };
}
