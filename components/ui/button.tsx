"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "shadow hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "border shadow-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { colors, colorMode } = useTheme();
    const Comp = asChild ? Slot : "button";

    const getVariantStyles = () => {
      if (!variant) return {};

      const baseStyles = {
        default: {
          backgroundColor: colors.primary,
          color: colorMode === "dark" ? "white" : "white",
        },
        destructive: {
          backgroundColor: colorMode === "dark" ? "#991b1b" : "#dc2626",
          color: "white",
        },
        outline: {
          borderColor: colorMode === "dark" ? "#4a5568" : "#e2e8f0",
          color: colors.text,
        },
        secondary: {
          backgroundColor: colors.secondary,
          color: colorMode === "dark" ? "white" : "white",
        },
        ghost: {
          color: colors.text,
        },
        link: {
          color: colors.primary,
        },
      };

      return baseStyles[variant as keyof typeof baseStyles] || {};
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={getVariantStyles()}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
