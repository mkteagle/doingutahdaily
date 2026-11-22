import { auth, getAdminSession } from "@/auth";

async function handleAuth(request: Request) {
  const path = new URL(request.url).pathname;
  if ((path === "/api/auth/passkey/generate-register-options" || path === "/api/auth/passkey/verify-registration") &&
      !await getAdminSession(request.headers)) {
    return Response.json({ error: "Sign in to add a passkey." }, { status: 401 });
  }

  return auth.handler(request);
}

export { handleAuth as GET, handleAuth as POST };
