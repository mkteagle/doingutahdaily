"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme/theme";

interface PricingTableProps {
  items: Array<{
    name: string;
    price: string;
    description?: string;
  }>;
}

export function PricingTable({ items }: PricingTableProps) {
  const { colorMode } = useTheme();

  return (
    <div className="container mx-auto my-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg",
              colorMode === "dark"
                ? "bg-gray-800/50 border-gray-700 text-gray-100"
                : "bg-white/50 border-gray-200 text-gray-900",
              "border transition-colors"
            )}
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-2",
                colorMode === "dark" ? "text-gray-100" : "text-gray-900"
              )}
            >
              {item.name}
            </h3>
            <p className="text-2xl font-bold text-primary mb-2">{item.price}</p>
            {item.description && (
              <p
                className={cn(
                  "text-sm",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
