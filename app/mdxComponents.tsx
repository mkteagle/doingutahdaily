"use client";
import { MDXComponents } from "mdx/types";
import { CalloutBox } from "@/components/Blog/CalloutBox";
import { ImageGrid } from "@/components/Blog/ImageGrid";
import { PricingTable } from "@/components/Blog/PricingTable";
import {
  H1,
  H2,
  H3,
  H4,
  Paragraph,
  InlineLink,
} from "@/components/ui/typography";

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ className, ...props }) => <H1 className={className} {...props} />,
    h2: ({ className, ...props }) => <H2 className={className} {...props} />,
    h3: ({ className, ...props }) => <H3 className={className} {...props} />,
    h4: ({ className, ...props }) => <H4 className={className} {...props} />,
    // Use a div for paragraphs in MDX to avoid nesting issues
    p: ({ className, ...props }) => (
      <Paragraph className={className} {...props} />
    ),
    a: ({ className, ...props }) => (
      // @ts-ignore
      <InlineLink className={className} {...props} />
    ),
    CalloutBox,
    ImageGrid,
    PricingTable,
  };
}
