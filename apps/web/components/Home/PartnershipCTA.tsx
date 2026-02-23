"use client";
import { useTheme } from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PartnershipCTA() {
  const { colors, colorMode } = useTheme();

  const stats = [
    {
      icon: Users,
      stat: "50K+",
      label: "Monthly Readers",
    },
    {
      icon: Calendar,
      stat: "200+",
      label: "Events Covered",
    },
    {
      icon: ArrowRight,
      stat: "85%",
      label: "Engagement Rate",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with theme-aware gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center",
          colorMode === "dark"
            ? "bg-gradient-to-br from-gray-900 to-gray-800 opacity-95"
            : "bg-gradient-to-br from-gray-800 to-gray-700 opacity-90"
        )}
        style={{
          backgroundImage: "url('/api/placeholder/1920/600')",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          style={{
            background: `linear-gradient(45deg, transparent 0%, ${colors.primary} 100%)`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Handshake className="w-6 h-6" style={{ color: colors.primary }} />
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: colors.primary }}
            >
              Partner With Us
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Showcase Your
            <span className="block" style={{ color: colors.primary }}>
              Utah Experience?
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8">
            Join forces with Utah's fastest-growing family events platform.
            Reach thousands of engaged local families actively seeking their
            next adventure.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg p-6 border",
                  colorMode === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-black/5 border-white/20",
                  "backdrop-blur-sm"
                )}
              >
                <item.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: colors.primary }}
                />
                <div className="text-3xl font-bold text-white mb-1">
                  {item.stat}
                </div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>

          <Link href="/contact">
            <Button
              size="lg"
              className="group text-white hover:opacity-90 transition-all duration-300 text-lg px-8 py-6"
              style={{ backgroundColor: colors.primary }}
            >
              Become a Partner
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
