import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, BookOpen, Users, Mail } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { HeaderThemeControls } from "./HeaderThemeControls";

export function MobileNavigation() {
  const pathname = usePathname();
  const { colors, colorMode } = useTheme();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Calendar,
      label: "Events",
      href: "/events",
    },
    {
      icon: BookOpen,
      label: "Blog",
      href: "/blog",
    },
    {
      icon: Users,
      label: "About",
      href: "/about",
    },
    {
      icon: Mail,
      label: "Contact",
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Mobile Logo Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 h-16 px-4",
          "flex items-center justify-between", // Changed to justify-between
          "border-b backdrop-blur-lg",
          "z-50",
          colorMode === "dark"
            ? "bg-gray-900/90 border-gray-800"
            : "bg-white/90 border-gray-200"
        )}
      >
        <Link href="/" className="flex items-center space-x-2">
          <svg viewBox="0 0 246.24 155.76" className="w-8 h-8">
            <path
              d="M.51,120.76c1.53-2.91,2.88-5.94,4.61-8.72,13.88-22.32,29.12-43.72,44.77-64.81,10.98-14.79,22.47-29.19,33.74-43.76.92-1.19,1.95-2.3,2.93-3.45.08,0,.16,0,.24,0,7.99,12.01,15.98,24.02,23.97,36.03,2.21,3.32,5.14,5.87,8.58,7.85,6.49,3.73,13,7.45,19.49,11.19,2.87,1.65,5.62,1.75,8.57,0,4.15-2.45,8.24-2.01,12.01,1.01,1.43,1.15,2.81,2.35,4.2,3.55,1.94,1.67,3.5,1.69,5.4-.01,4.37-3.91,8.69-7.88,13.09-11.75,2.71-2.38,3.66-2.27,5.72.71,8.21,11.87,16.28,23.85,24.58,35.65,7.43,10.56,15.7,20.44,25.19,29.25.15.14.36.25.41.42.29.9.55,1.81.81,2.71-.75-.23-1.58-.34-2.25-.71-10.57-5.84-21.11-11.71-32.38-17.97.23,1.21.17,2,.52,2.51,4.44,6.53,8.94,13.02,13.39,19.54.26.38.19.98.28,1.48-.54.05-1.22.33-1.61.11-9.91-5.55-19.78-11.15-29.66-16.75-.83-.47-1.65-.98-2.5-1.4-3.29-1.61-5.9-1.18-8.49,1.42-5.27,5.28-10.51,10.58-15.93,16.04-2.15-3.1-4.3-6.02-6.26-9.06-2.41-3.76-3.88-4.03-7.31-1.22-6.66,5.47-13.36,10.89-19.97,16.26-8.43-4.65-16.73-9.22-25.04-13.79-4.57-2.52-9.13-5.06-13.73-7.52-.54-.29-1.38-.35-1.97-.16-10.54,3.38-21.06,6.84-31.61,10.21-.61.19-1.51.09-2.06-.23-8.39-4.91-16.75-9.9-25.15-14.8-.47-.28-1.52-.18-1.94.17-7.88,6.44-15.7,12.94-23.55,19.42-.32.26-.75.38-1.13.57,0,0,.03.02.03.02Z"
              fill={colors.primary}
              className="transition-colors duration-300"
            />
          </svg>
          <span
            className={cn(
              "text-lg font-semibold",
              colorMode === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            Doing Utah Daily
          </span>
        </Link>

        {/* Theme Controls */}
        <HeaderThemeControls />
      </header>

      {/* Bottom Navigation */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 h-20",
          "flex items-center justify-around px-2",
          "border-t backdrop-blur-lg",
          "z-50", // High z-index for navigation
          colorMode === "dark"
            ? "bg-gray-900/90 border-gray-800"
            : "bg-white/90 border-gray-200"
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "w-16 h-16 rounded-lg",
                "transition-all duration-200",
                isActive && "scale-110"
              )}
            >
              <item.icon
                className="w-6 h-6 mb-1"
                style={{
                  color: isActive
                    ? colors.primary
                    : colorMode === "dark"
                    ? "#9CA3AF"
                    : "#4B5563",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  color: isActive
                    ? colors.primary
                    : colorMode === "dark"
                    ? "#9CA3AF"
                    : "#4B5563",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
