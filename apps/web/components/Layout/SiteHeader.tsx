"use client";
import Link from "next/link";
import ThemedLogo from "@/components/Layout/ThemedLogo";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { HeaderThemeControls } from "@/components/Layout/HeaderThemeControls";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { colorMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md border-b-2 transition-all duration-300",
        colorMode === "dark"
          ? "bg-[hsl(var(--background))]/80 border-[hsl(var(--primary))]"
          : "bg-[hsl(var(--background))]/90 border-[hsl(var(--primary))]"
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 hover:scale-105 transition-transform duration-300 relative z-10"
          >
            <ThemedLogo className="h-12 lg:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navigationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 xl:px-6 py-2 font-bold text-base xl:text-lg transition-all duration-300 group",
                  colorMode === "dark"
                    ? "text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                )}
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[hsl(var(--primary))] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Theme Controls */}
          <div className="hidden lg:flex items-center gap-6">
            <div className={cn(
              "h-10 w-px",
              colorMode === "dark" ? "bg-[hsl(var(--border))]" : "bg-[hsl(var(--border))]"
            )}></div>
            <HeaderThemeControls />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--primary))]/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[hsl(var(--foreground))]" />
            ) : (
              <Menu className="w-6 h-6 text-[hsl(var(--foreground))]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={cn(
              "lg:hidden py-6 border-t animate-slide-up",
              colorMode === "dark" ? "border-[hsl(var(--border))]" : "border-[hsl(var(--border))]"
            )}
          >
            <nav className="flex flex-col gap-1">
              {navigationLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 font-bold text-lg rounded-lg transition-all duration-200",
                    colorMode === "dark"
                      ? "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                      : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className={cn(
              "mt-6 pt-6 border-t",
              colorMode === "dark" ? "border-[hsl(var(--border))]" : "border-[hsl(var(--border))]"
            )}>
              <HeaderThemeControls />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
