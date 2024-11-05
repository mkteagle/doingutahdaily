import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme";
import { Suspense } from "react";
import { EnhancedLoadingScreen } from "@/components/Loading/EnhancedLoadingScreen";
import MDXWrapper from "./MdxWrapper";
import { ImageBrightnessProvider } from "@/context/ImageBrightnessContext";
import { SiteLayout } from "@/components/Layout/SiteLayout";

export const metadata: Metadata = {
  title: "Doing Utah Daily",
  description: "Your number one destination for all events",
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
