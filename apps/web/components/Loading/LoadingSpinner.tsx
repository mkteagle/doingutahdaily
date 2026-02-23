"use client";
import { useTheme } from "@/theme/theme";

export function LoadingSpinner({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const { colors } = useTheme();

  const sizeClasses = {
    small: "w-5 h-5",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[200px]">
      <div className="relative flex flex-col items-center gap-3">
        {/* Main spinner */}
        <div
          className={`${sizeClasses[size]} animate-spin`}
          style={{ filter: `drop-shadow(0 0 8px ${colors.primary}40)` }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
              stroke={colors.primary}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Optional pulse effect behind the spinner */}
        <div
          className={`absolute ${sizeClasses[size]} animate-ping opacity-25 rounded-full`}
          style={{ backgroundColor: colors.primary }}
        />

        {/* Loading text */}
        <span
          className="text-sm font-medium animate-pulse"
          style={{ color: colors.primary }}
        >
          Loading...
        </span>
      </div>
    </div>
  );
}
