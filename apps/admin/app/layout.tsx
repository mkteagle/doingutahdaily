import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getAdminSession, passkeysEnabled } from "@/auth";

export const metadata: Metadata = {
  title: "Doing Utah Daily Admin",
  description: "Admin dashboard for Doing Utah Daily",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <html lang="en">
      <body>
        <AppShell passkeysEnabled={passkeysEnabled} adminEmail={session?.user.email}>{children}</AppShell>
      </body>
    </html>
  );
}
