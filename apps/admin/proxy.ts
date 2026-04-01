import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = ["/sign-in"];

export default auth((req) => {
  const { nextUrl } = req;
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isPublicPage = PUBLIC_PATHS.some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isAuthenticated = !!req.auth?.user;

  if (isApiAuth) {
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
