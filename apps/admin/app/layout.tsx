import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Doing Utah Daily Admin",
  description: "Admin dashboard for Doing Utah Daily",
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
          <div className="min-h-screen bg-sand md:flex">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
