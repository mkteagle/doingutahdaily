"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { MountainMark } from "@dud/ui/mountain-mark";
import { useTheme } from "@/theme/theme";

const nav = [
  { href: "/activities", label: "Activities" },
  { href: "/events", label: "This Weekend" },
  { href: "/blog", label: "Stories" },
  { href: "/instagram", label: "Instagram" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useTheme();
  const colorSchemeButton = (
    <button type="button" className="field-icon-button" onClick={toggleColorMode} aria-label="Toggle color mode">
      {colorMode === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );

  return (
    <header className="field-header">
      <div className="field-container field-header-inner">
        <Link href="/" className="field-wordmark" aria-current={pathname === "/" ? "page" : undefined}>
          <MountainMark className="w-[56px] shrink-0 text-canyon sm:w-[4.75rem] lg:w-[5.2rem]" />
          <span className="min-w-0 break-words">Doing Utah Daily</span>
        </Link>
        <div className="field-theme-mobile">{colorSchemeButton}</div>
        <nav id="site-navigation" aria-label="Main navigation" className="field-nav">
          {nav.map(({ href, label }) => {
            const current = pathname === href ? "page" : pathname.startsWith(`${href}/`) ? "location" : undefined;

            return (
              <Link key={href} href={href} aria-current={current}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="field-theme-desktop">{colorSchemeButton}</div>
      </div>
    </header>
  );
}
