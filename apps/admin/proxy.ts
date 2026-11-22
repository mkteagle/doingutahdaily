import { type NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/auth";

export default async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const isPublicPage = nextUrl.pathname === "/sign-in";

  const isCron = nextUrl.pathname === "/api/cron/publish-posts" ||
    nextUrl.pathname === "/api/cron/sync-instagram";
  if (nextUrl.pathname.startsWith("/api/auth/") || nextUrl.pathname === "/api/mcp" || isCron) {
    return NextResponse.next();
  }

  const session = await getAdminSession(req.headers);
  if (!session) {
    if (nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isPublicPage) {
      const signInUrl = new URL("/sign-in", nextUrl);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (session && isPublicPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api)(.*)",
  ],
};
