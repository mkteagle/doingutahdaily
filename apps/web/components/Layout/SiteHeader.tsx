"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Mountain } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Partner with us", cta: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background/60 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Mountain size={18} strokeWidth={2.5} />
              </span>
              <div className="leading-none">
                <div className="font-display text-[15px] tracking-tight text-foreground">
                  Doing Utah
                </div>
                <div className="font-body text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                  Daily
                </div>
              </div>
            </Link>

            {/* Desktop nav + dark mode */}
            <div className="hidden md:flex items-center gap-0.5">
              <nav className="flex items-center gap-0.5">
                {NAV_LINKS.map(({ href, label, cta }) => {
                  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        cta
                          ? "ml-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : active
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {colorMode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>

            {/* Mobile: hamburger only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-40 md:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <span className="font-display text-sm text-foreground">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {NAV_LINKS.map(({ href, label, cta }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    cta
                      ? "mt-2 bg-primary text-primary-foreground text-center hover:bg-primary/90"
                      : active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="px-6 pb-8 pt-4 border-t border-border">
            <button
              onClick={toggleColorMode}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {colorMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {colorMode === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Layout spacer */}
      <div className="h-16 md:h-20" aria-hidden />
    </>
  );
}
