"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { HTMLAttributes, ComponentPropsWithoutRef } from "react";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type BodyProps = ComponentPropsWithoutRef<"div">;

export function H1({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h1">) {
  const { colorMode } = useTheme();

  return (
    <h1
      className={cn(
        "scroll-m-20",
        "text-4xl font-bold tracking-tight lg:text-5xl",
        colorMode === "dark" ? "text-white" : "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  const { colorMode } = useTheme();

  return (
    <h2
      className={cn(
        "scroll-m-20",
        "text-3xl font-semibold tracking-tight first:mt-0",
        colorMode === "dark" ? "text-white" : "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  const { colorMode } = useTheme();

  return (
    <h3
      className={cn(
        "scroll-m-20",
        "text-2xl font-semibold tracking-tight",
        colorMode === "dark" ? "text-white" : "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h4">) {
  const { colorMode } = useTheme();

  return (
    <h4
      className={cn(
        "scroll-m-20",
        "text-xl font-semibold tracking-tight",
        colorMode === "dark" ? "text-white" : "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Paragraph({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { colorMode } = useTheme();

  // Determine text color based on the current color mode
  const textColor = colorMode === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div
      className={cn(
        "leading-7", // Base styling
        textColor, // Color based on color mode
        "[&:not(:first-child)]:mt-6", // Margin styling
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Body({ className, children, ...props }: BodyProps) {
  const { colorMode } = useTheme();
  return (
    <div
      className={cn(
        "leading-7",
        colorMode === "dark" ? "text-white" : "text-foreground",
        "[&:not(:first-child)]:mt-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function InlineLink({
  href,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium underline underline-offset-4",
        "text-primary hover:text-primary/80",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function Lead({ className, children, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-xl text-muted-foreground", "leading-8", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Large({ className, children, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-lg font-semibold", "text-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Small({ className, children, ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium leading-none",
        "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Subtle({ className, children, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function BlockQuote({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-primary",
        "pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

interface NavLinkProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
  label: string;
  className?: string;
}

export function NavLink({ href, label, className, ...props }: NavLinkProps) {
  const { colors, colorMode } = useTheme(); // Get seasonal theme colors
  const pathname = usePathname(); // Get current path

  // Determine if the link is active
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative font-medium transition-colors duration-300 py-2", // Updated duration for animation smoothness
        className
      )}
      style={{
        color: isActive
          ? colors.primary // Use a different color (like secondary or accent)
          : colorMode === "dark"
          ? "#b3b3b3" // Custom lighter gray for non-active links in dark mode
          : "#4a4a4a", // Custom darker gray for non-active links in light mode
      }}
      {...props}
    >
      {label}

      {/* Underline animation */}
      <span
        className={cn(
          "absolute bottom-[-2px] left-0 h-[2px] bg-secondary transition-transform duration-300",
          isActive ? "w-full" : "w-0", // Start width
          "hover:w-full" // Full width on hover
        )}
        style={{ backgroundColor: colors.primary }}
      />

      <style jsx>{`
        a:hover {
          color: ${colors.primary}; // Set the hover color to something else
        }
      `}</style>
    </Link>
  );
}
