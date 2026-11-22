import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/pageMetadata";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme";
import { Suspense } from "react";
import { EnhancedLoadingScreen } from "@/components/Loading/EnhancedLoadingScreen";
import MDXWrapper from "./MdxWrapper";
import { ImageBrightnessProvider } from "@/context/ImageBrightnessContext";
import { SiteLayout } from "@/components/Layout/SiteLayout";

const siteTitle = "Doing Utah Daily | Utah Family Activities & Weekend Plans";
const siteDescription = "Find family-friendly outings, local tips, and things to do this weekend in Utah.";
const { openGraph, twitter } = pageMetadata({ path: "/", title: siteTitle, description: siteDescription });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s | Doing Utah Daily"
  },
  description: siteDescription,
  keywords: ["Utah events", "Utah activities", "family events Utah", "things to do in Utah", "Salt Lake City events", "Utah family fun", "Utah adventures", "weekend plans Utah"],
  authors: [{ name: "Doing Utah Daily" }],
  creator: "Doing Utah Daily",
  publisher: "Doing Utah Daily",
  openGraph,
  twitter,
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
