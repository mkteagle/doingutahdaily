"use client";
import Link from "next/link";
import { useTheme } from "@/theme/theme";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Camera,
  Heart,
} from "lucide-react";
import ThemedLogo from "./ThemedLogo";

export function SiteFooter() {
  const { colors, colorMode } = useTheme();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  const quickLinks = [
    { name: "Home", href: "/", icon: Heart },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Community", href: "/community", icon: Users },
    { name: "Gallery", href: "/gallery", icon: Camera },
  ];

  const contactInfo = [
    { icon: Mail, text: "hello@doingutahdaily.com" },
    { icon: Phone, text: "(801) 123-4567" },
    { icon: MapPin, text: "Salt Lake City, Utah" },
  ];

  // Dynamic styles based on color mode
  const styles = {
    footer: {
      backgroundColor: colorMode === "light" ? "#2d3748" : "#1a1f2d",
    },
    heading: {
      color: colorMode === "light" ? "#f7fafc" : "#f0f4f8",
    },
    text: {
      color: colorMode === "light" ? "#cbd5e0" : "#e2e8f0",
    },
    mutedText: {
      color: colorMode === "light" ? "#a0aec0" : "#cbd5e0",
    },
    icon: {
      color: colors.primary,
    },
    border: {
      borderColor: colorMode === "light" ? "#4a5568" : "#2d3748",
    },
  };

  return (
    <footer style={styles.footer} className="transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 style={styles.heading} className="text-lg font-semibold mb-4">
              About Us
            </h3>
            <p style={styles.mutedText} className="mb-4">
              Doing Utah Daily is your go-to source for family-friendly events
              and activities across Utah. We help you discover the magic in
              every corner of our beautiful state.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  style={styles.mutedText}
                  className="hover:text-primary transition-colors"
                  aria-label={name}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={styles.heading} className="text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <Link
                    href={href}
                    style={styles.mutedText}
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Icon size={16} />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 style={styles.heading} className="text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={16} style={styles.icon} />
                  <span style={styles.mutedText}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo Section (replaces Newsletter) */}
          <div className="flex flex-col items-center justify-center">
            <ThemedLogo className="w-48 h-auto mb-4" />
          </div>
        </div>

        <div
          className="mt-12 pt-8 text-center"
          style={{
            ...styles.mutedText,
            borderTop: `1px solid ${
              colorMode === "light" ? "#4a5568" : "#2d3748"
            }`,
          }}
        >
          <p>
            © {new Date().getFullYear()} Doing Utah Daily. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
