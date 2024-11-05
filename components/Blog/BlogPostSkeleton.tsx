"use client";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { Skeleton } from "../Loading/Skeleton";

export function BlogPostSkeleton() {
  const { colors, colorMode } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] min-h-[600px]">
        <div
          className={cn(
            "absolute inset-0",
            colorMode === "dark" ? "bg-gray-900" : "bg-gray-100"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
              <div className="max-w-4xl space-y-6">
                {/* Category badges skeleton */}
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className={cn(
                        "h-6 w-20 rounded-full",
                        colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>

                {/* Meta info skeleton */}
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className={cn(
                        "h-5 w-32",
                        colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>

                {/* Title skeleton */}
                <div className="space-y-4">
                  <Skeleton
                    className={cn(
                      "h-12 w-3/4",
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-12 w-1/2",
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-8 space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton
                  className={cn(
                    "h-6 w-full",
                    colorMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                  )}
                />
                <Skeleton
                  className={cn(
                    "h-6 w-11/12",
                    colorMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                  )}
                />
                <Skeleton
                  className={cn(
                    "h-6 w-4/5",
                    colorMode === "dark" ? "bg-gray-800" : "bg-gray-100"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-4">
            <div
              className={cn(
                "rounded-xl border shadow p-6",
                colorMode === "dark"
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white border-gray-200"
              )}
            >
              <Skeleton
                className={cn(
                  "h-8 w-1/2 mb-4",
                  colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                )}
              />
              <Skeleton
                className={cn(
                  "h-4 w-3/4 mb-6",
                  colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                )}
              />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 mb-4">
                  <Skeleton
                    className={cn(
                      "h-6 w-32 rounded-full",
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-4 w-8",
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
