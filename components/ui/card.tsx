"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";

// Main Card component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { colorMode } = useTheme();

  // Determine background and text colors based on the color mode
  const bgColor = colorMode === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textColor = colorMode === "dark" ? "text-white" : "text-gray-900";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border shadow-md p-6", // Base styles
        bgColor, // Background color based on colorMode
        textColor, // Text color based on colorMode
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

// CardHeader component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// CardTitle component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// CardDescription component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// CardContent component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// CardFooter component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// FeatureCard component
interface FeatureCardProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  ...props
}: FeatureCardProps) => {
  const { colorMode, colors } = useTheme();

  // Determine background and text colors based on the color mode
  const bgColor = colorMode === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textColor = colorMode === "dark" ? "text-white" : "text-gray-900";
  const descriptionColor =
    colorMode === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`flex gap-4 p-6 rounded-lg ${bgColor} shadow-md border border-gray-600`}
      {...props}
    >
      <div className="flex-shrink-0">
        <Icon
          className="w-8 h-8"
          //@ts-ignore
          style={{ color: colors.primary }}
        />
      </div>
      <div>
        <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{title}</h3>
        <p className={`${descriptionColor}`}>{description}</p>
      </div>
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  FeatureCard,
};
