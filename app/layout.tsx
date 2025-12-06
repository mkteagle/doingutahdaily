import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme";
import { Suspense } from "react";
import { EnhancedLoadingScreen } from "@/components/Loading/EnhancedLoadingScreen";
import MDXWrapper from "./MdxWrapper";
import { ImageBrightnessProvider } from "@/context/ImageBrightnessContext";
import { SiteLayout } from "@/components/Layout/SiteLayout";

export const metadata: Metadata = {
  metadataBase: new URL('https://doingutahdaily.com'),
  title: {
    default: "Doing Utah Daily - Discover Utah's Best Family Events & Activities",
    template: "%s | Doing Utah Daily"
  },
  description: "Your trusted guide to family-friendly events and unforgettable adventures across Utah. Discover seasonal activities, local attractions, and weekend plans updated daily.",
  keywords: ["Utah events", "Utah activities", "family events Utah", "things to do in Utah", "Salt Lake City events", "Utah family fun", "Utah adventures", "weekend plans Utah"],
  authors: [{ name: "Doing Utah Daily" }],
  creator: "Doing Utah Daily",
  publisher: "Doing Utah Daily",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doingutahdaily.com",
    siteName: "Doing Utah Daily",
    title: "Doing Utah Daily - Discover Utah's Best Family Events & Activities",
    description: "Your trusted guide to family-friendly events and unforgettable adventures across Utah.",
    images: [
      {
        url: "/apple-icon.png",
        width: 180,
        height: 180,
        alt: "Doing Utah Daily"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Doing Utah Daily - Discover Utah's Best Family Events & Activities",
    description: "Your trusted guide to family-friendly events and unforgettable adventures across Utah.",
    images: ["/apple-icon.png"],
    creator: "@doingutahdaily"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Suspense fallback={<EnhancedLoadingScreen />}>
            <MDXWrapper>
              <ImageBrightnessProvider>
                <SiteLayout>{children}</SiteLayout>
              </ImageBrightnessProvider>
            </MDXWrapper>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
