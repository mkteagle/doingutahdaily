import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { mcp } from "@better-auth/mcp";
import { passkey } from "@better-auth/passkey";
import { adminAccounts, adminOAuthSchema, adminPasskeys, adminSessions, adminUsers, adminVerifications, db } from "@dud/db";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { SignJWT, importPKCS8 } from "jose";
import { headers } from "next/headers";

const allowedEmails = new Set([
  "mkteagle@gmail.com",
  "jen.a.jarrett@gmail.com",
  "doingutdaily@gmail.com",
]);

function normalizePrivateKey(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n")
    .replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
}

async function createAppleClientSecret() {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;
  const clientId =
    process.env.APPLE_SERVICE_ID || process.env.APPLE_CLIENT_ID;

  if (!teamId || !keyId || !privateKey || !clientId) {
    return undefined;
  }

  const pkcs8 = normalizePrivateKey(privateKey);
  const key = await importPKCS8(pkcs8, "ES256");
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setAudience("https://appleid.apple.com")
    .setSubject(clientId)
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60 * 24 * 150)
    .sign(key);
}

const appleClientId =
  process.env.APPLE_SERVICE_ID ||
  process.env.APPLE_CLIENT_ID;
const appleClientSecret =
  process.env.APPLE_CLIENT_SECRET ||
  (await createAppleClientSecret().catch((err) => {
    console.error("[auth] Failed to generate Apple client secret:", err.message);
    return undefined;
  }));

const { GOOGLE_CLIENT_ID: googleClientId, GOOGLE_CLIENT_SECRET: googleClientSecret } = process.env;
const socialProviders = {
  ...(googleClientId && googleClientSecret && {
    google: { clientId: googleClientId, clientSecret: googleClientSecret, disableIdTokenSignIn: true },
  }),
  ...(appleClientId && appleClientSecret && {
    apple: { clientId: appleClientId, clientSecret: appleClientSecret, disableIdTokenSignIn: true },
  }),
};

export const signInMethods = (["google", "apple"] as const).filter((id) => socialProviders[id]);

const origin = new URL(process.env.BETTER_AUTH_URL || process.env.AUTH_URL || (
  process.env.VERCEL_ENV === "production" ? "https://admin.doingutahdaily.com" :
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001"
));
export const adminOrigin = origin.origin;
export const mcpResource = new URL("/api/mcp", adminOrigin).href;
export const mcpDraftScope = "drafts:edit";
export const mcpScopes = [mcpDraftScope, "offline_access"];

export const passkeysEnabled = process.env.AUTH_PASSKEYS_ENABLED === "true" && (
  origin.protocol === "https:" || (origin.protocol === "http:" && origin.hostname === "localhost")
);

export function isApprovedAdmin(user?: { email?: string; emailVerified?: boolean } | null) {
  return user?.emailVerified === true && !!user.email && allowedEmails.has(user.email.toLowerCase());
}

export const auth = betterAuth({
  appName: "Doing Utah Daily Admin",
  baseURL: origin.origin,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: adminUsers,
      session: adminSessions,
      account: adminAccounts,
      verification: adminVerifications,
      passkey: adminPasskeys,
      ...adminOAuthSchema,
    },
  }),
  disabledPaths: ["/token"],
  rateLimit: { storage: "database" },
  advanced: process.env.VERCEL === "1" ? {
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for"] },
  } : undefined,
  socialProviders,
  trustedOrigins: socialProviders.apple ? ["https://appleid.apple.com"] : [],
  onAPIError: { errorURL: `${origin.origin}/sign-in` },
  account: { encryptOAuthTokens: true },
  user: {
    validateUserInfo({ user }) {
      return isApprovedAdmin(user) ? undefined : { error: "access_denied" };
    },
  },
  databaseHooks: {
    session: {
      create: {
        async before(session, context) {
          const user = await context?.context.internalAdapter.findUserById(session.userId);
          return isApprovedAdmin(user ?? undefined) ? undefined : false;
        },
      },
    },
  },
  plugins: [
    jwt({ disableSettingJwtHeader: true }),
    mcp({
      loginPage: "/sign-in",
      consentPage: "/mcp/approve",
      resource: mcpResource,
      scopes: mcpScopes,
      grantTypes: ["authorization_code", "refresh_token"],
      allowDynamicClientRegistration: true,
      allowUnauthenticatedClientRegistration: true,
      clientRegistrationDefaultApplicationType: "infer",
      clientRegistrationDefaultScopes: mcpScopes,
      accessTokenExpiresIn: 600,
      validateRedirectUri(uri, _registeredUris, matches) {
        if (!matches) return false;
        const url = new URL(uri);
        if (url.href === "https://chatgpt.com/connector_platform_oauth_redirect") return true;
        return url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      },
    }),
    ...(passkeysEnabled ? [passkey({
      rpID: origin.hostname,
      rpName: "Doing Utah Daily Admin",
      origin: origin.origin,
      registration: { requireSession: true },
    })] : []),
  ],
});

export async function getAdminSession(requestHeaders?: Headers) {
  const session = await auth.api.getSession({ headers: requestHeaders ?? await headers() });
  return isApprovedAdmin(session?.user) ? session : null;
}
