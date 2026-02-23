// components/Blog/MarkdownContent.tsx
"use client";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  children: React.ReactNode;
}

export function MarkdownContent({ children }: MarkdownContentProps) {
  // Only apply needed styles without automatic margins
  return (
    <div
      className={cn(
        "prose lg:prose-xl dark:prose-invert",
        // Lists
        "[&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6",
        "[&>ul]:text-gray-700 [&>ul]:dark:text-gray-300",
        "[&>ol]:text-gray-700 [&>ol]:dark:text-gray-300",
        // Inline elements
        "[&>p>code]:text-primary [&>p>code]:text-sm",
        "[&>p>code]:bg-primary/10 [&>p>code]:rounded",
        "[&>p>code]:px-1 [&>p>code]:py-0.5",
        // Block quotes
        "[&>blockquote]:border-l-4 [&>blockquote]:border-primary",
        "[&>blockquote]:pl-4 [&>blockquote]:italic",
        "[&>blockquote]:text-gray-700 [&>blockquote]:dark:text-gray-300"
      )}
    >
      {children}
    </div>
  );
}
