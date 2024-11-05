"use client";
import Link from "next/link";
import ThemedLogo from "@/components/Layout/ThemedLogo";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { NavLink } from "../ui/typography";
import { HeaderThemeControls } from "@/components/Layout/HeaderThemeControls";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { colors, colorMode } = useTheme();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-sm shadow-sm",
        colorMode === "dark"
          ? "bg-gray-900/90 border-gray-800"
          : "bg-white/80 border-gray-200"
      )}
    >
      <div className="container mx-auto px-4 h-20">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <ThemedLogo className="h-14 w-auto" />
          </Link>

          {/* Navigation and Theme Controls */}
          <div className="flex items-center">
            <nav className="mr-12">
              <ul className="flex items-center space-x-10">
                {navigationLinks.map(({ href, label }) => (
                  <li key={href}>
                    <NavLink href={href} label={label} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Separator */}
            <div
              className={cn(
                "h-8 w-px mr-12",
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
              )}
            />

            {/* Theme Controls */}
            <HeaderThemeControls />
          </div>
        </div>
      </div>
    </header>
  );
}
