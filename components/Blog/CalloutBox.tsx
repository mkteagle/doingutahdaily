"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";
import type { ComponentPropsWithoutRef } from "react";

export interface CalloutBoxProps extends ComponentPropsWithoutRef<"div"> {
  type?: "info" | "tip" | "warning";
}

export function CalloutBox({
  type = "info",
  children,
  className,
  ...props
}: CalloutBoxProps) {
  const { colorMode } = useTheme();

  return (
    <div
      className={cn(
        "container mx-auto my-8 p-6 rounded-lg",
        colorMode === "dark"
          ? "bg-gray-800/50 text-gray-100"
          : "bg-gray-50/50 text-gray-900",
        "border-l-4",
        {
          "border-blue-500": type === "info",
          "border-green-500": type === "tip",
          "border-yellow-500": type === "warning",
        },
        colorMode === "dark" ? "border-opacity-75" : "border-opacity-100",
        className
      )}
      {...props}
    >
      <div className="prose-content">{children}</div>
    </div>
  );
}
