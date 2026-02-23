"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";

// Input component
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const { colorMode } = useTheme();

    return (
      <div className="relative">
        {icon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              colorMode === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            "w-full rounded-lg border bg-transparent",
            "text-sm transition-colors duration-200",
            icon ? "pl-10 pr-4" : "px-4",
            "py-2",

            // Color mode specific styles
            colorMode === "dark"
              ? [
                  "border-gray-700",
                  "bg-gray-800/50",
                  "text-gray-100",
                  "placeholder:text-gray-400",
                  "hover:bg-gray-800/70",
                  "focus:border-gray-600",
                ]
              : [
                  "border-gray-200",
                  "bg-white",
                  "text-gray-900",
                  "placeholder:text-gray-500",
                  "hover:bg-gray-50/80",
                  "focus:border-gray-300",
                ],

            // Focus styles
            "focus:outline-none focus:ring-2",
            colorMode === "dark"
              ? "focus:ring-gray-700/50"
              : "focus:ring-gray-200/50",

            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

// Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { colorMode } = useTheme();

    return (
      <textarea
        className={cn(
          // Base styles
          "w-full rounded-lg border bg-transparent",
          "text-sm transition-colors duration-200 px-4 py-2 min-h-[150px]",

          // Color mode specific styles
          colorMode === "dark"
            ? [
                "border-gray-700",
                "bg-gray-800/50",
                "text-gray-100",
                "placeholder:text-gray-400",
                "hover:bg-gray-800/70",
                "focus:border-gray-600",
              ]
            : [
                "border-gray-200",
                "bg-white",
                "text-gray-900",
                "placeholder:text-gray-500",
                "hover:bg-gray-50/80",
                "focus:border-gray-300",
              ],

          // Focus styles
          "focus:outline-none focus:ring-2",
          colorMode === "dark"
            ? "focus:ring-gray-700/50"
            : "focus:ring-gray-200/50",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Label component
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const { colorMode } = useTheme();

    return (
      <label
        className={cn(
          "block text-sm font-medium mb-2",
          colorMode === "dark" ? "text-gray-300" : "text-gray-700",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Input, Textarea, Label };
