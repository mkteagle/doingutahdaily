// app/MdxWrapper.tsx
"use client";

import { MDXProvider } from "@mdx-js/react";
import MDXComponents from "./mdxComps";

interface MDXWrapperProps {
  children: React.ReactNode;
}

export default function MDXWrapper({ children }: MDXWrapperProps) {
  return <MDXProvider components={MDXComponents}>{children}</MDXProvider>;
}
