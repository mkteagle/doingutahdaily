import { NextRequest, NextResponse } from "next/server";
import { auth, handlers, isApprovedAdmin, passkeysEnabled } from "@/auth";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  if (passkeysEnabled && request.nextUrl.pathname === "/api/auth/callback/passkey") {
    const fields = await request.clone().formData().catch(() => null);
    if (!fields) return NextResponse.json({ error: "Invalid passkey request" }, { status: 400 });
    if (fields.get("action") === "register") {
      const session = await auth();
      if (!isApprovedAdmin(session?.user?.email)) {
        return NextResponse.json({ error: "Sign in to add a passkey." }, { status: 401 });
      }
    }
  }

  return handlers.POST(request);
}
