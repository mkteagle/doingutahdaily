import { NextResponse } from "next/server";
import { auth, isApprovedAdmin } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isPublicPage = nextUrl.pathname === "/sign-in";
  const isAuthenticated = isApprovedAdmin(req.auth?.user?.email);

  const isCron = nextUrl.pathname === "/api/cron/publish-posts" ||
    nextUrl.pathname === "/api/cron/sync-instagram";
  if (nextUrl.pathname.startsWith("/api/auth/") || isCron) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isPublicPage) {
      const signInUrl = new URL("/sign-in", nextUrl);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isAuthenticated && isPublicPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api)(.*)",
  ],
};
