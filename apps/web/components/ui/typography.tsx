"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type ParagraphProps = ComponentPropsWithoutRef<"p">;
type BodyProps = ComponentPropsWithoutRef<"div">;

export function H1({ className, children, ...props }: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn("scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children, ...props }: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className={cn("scroll-m-20 text-xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Paragraph({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("leading-7 text-foreground/80 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Body({ className, children, ...props }: BodyProps) {
  return (
    <div
      className={cn("leading-7 text-foreground [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function InlineLink({ href, children, className, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <a
      href={href}
      className={cn("font-medium underline underline-offset-4 text-primary hover:text-primary/80 transition-colors", className)}
      {...props}
    >
      {children}
    </a>
  );
}

export function Lead({ className, children, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-xl text-muted-foreground leading-8", className)} {...props}>
      {children}
    </p>
  );
}

export function Large({ className, children, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function Small({ className, children, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-sm font-medium leading-none text-muted-foreground", className)} {...props}>
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

export function BlockQuote({ className, children, ...props }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground", className)}
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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative font-medium transition-colors duration-200 py-2",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {label}
      <span
        className={cn(
          "absolute bottom-[-2px] left-0 h-[2px] bg-primary transition-all duration-300",
          isActive ? "w-full" : "w-0"
        )}
      />
    </Link>
  );
}
