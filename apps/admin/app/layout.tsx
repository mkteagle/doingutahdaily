import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { AppShell } from "@/components/AppShell";
import { auth, passkeysEnabled } from "@/auth";

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
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <AppShell passkeysEnabled={passkeysEnabled}>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
