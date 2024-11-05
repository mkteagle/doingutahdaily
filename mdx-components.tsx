import type { MDXComponents } from "mdx/types";
import { H1, H2, H3, Paragraph } from "@/components/ui/typography";
import { ImageGrid } from "@/components/Blog/ImageGrid";
import { CalloutBox } from "@/components/Blog/CalloutBox";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography components
    h1: H1,
    h2: H2,
    h3: H3,
    p: Paragraph,

    // Custom blog components
    CalloutBox,
    ImageGrid,

    // Any additional components from the passed components prop
    ...components,
  };
}

export default useMDXComponents;
