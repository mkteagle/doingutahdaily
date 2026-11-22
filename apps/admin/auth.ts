import NextAuth, { type NextAuthConfig } from "next-auth";
import Passkey from "next-auth/providers/passkey";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { adminAuthAccounts, adminAuthenticators, adminAuthUsers, db } from "@dud/db";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";
import { SignJWT, importPKCS8 } from "jose";

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

const providers: NextAuthConfig["providers"] = [];
const signInMethods: ("google" | "apple")[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  signInMethods.push("google");
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
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

if (appleClientId && appleClientSecret) {
  signInMethods.push("apple");
  providers.push(
    Apple({
      clientId: appleClientId,
      clientSecret: appleClientSecret,
    })
  );
}

export { signInMethods };

export function isApprovedAdmin(email?: string | null) {
  return !!email && allowedEmails.has(email.toLowerCase());
}

const passkeyOrigin = process.env.AUTH_PASSKEYS_ENABLED === "true" && process.env.AUTH_URL
  ? new URL(process.env.AUTH_URL)
  : null;
export const passkeysEnabled = Boolean(passkeyOrigin && (
  passkeyOrigin.protocol === "https:" ||
  (passkeyOrigin.protocol === "http:" && passkeyOrigin.hostname === "localhost")
));

const adapter = passkeysEnabled ? DrizzleAdapter(db, {
  usersTable: adminAuthUsers,
  accountsTable: adminAuthAccounts,
  authenticatorsTable: adminAuthenticators,
}) : undefined;

if (adapter?.linkAccount) {
  const linkAccount = adapter.linkAccount;
  adapter.linkAccount = ({ userId, type, provider, providerAccountId }) =>
    linkAccount({ userId, type, provider, providerAccountId });
}

if (passkeysEnabled && passkeyOrigin) {
  providers.unshift(Passkey({
    enableConditionalUI: false,
    relayingParty: { id: passkeyOrigin.hostname, origin: passkeyOrigin.origin, name: "Doing Utah Daily Admin" },
    // Only a signed-in user may request enrollment. Email input cannot create an account.
    getUserInfo: async () => null,
  }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  experimental: { enableWebAuthn: passkeysEnabled },
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      const email =
        user.email?.toLowerCase() ||
        (typeof profile?.email === "string"
          ? profile.email.toLowerCase()
          : null);

      if (!isApprovedAdmin(email)) return false;
      if (passkeysEnabled && account?.type !== "webauthn") {
        const verifiedEmail: unknown = profile?.email_verified;
        return verifiedEmail === true || verifiedEmail === "true";
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email.toLowerCase();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
