import NextAuth from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";
import { SignJWT, importPKCS8 } from "jose";

const allowedEmails = new Set([
  "mkteagle@gmail.com",
  "jen.a.jarrett@gmail.com",
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

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
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
  process.env.APPLE_CLIENT_SECRET || (await createAppleClientSecret());

if (appleClientId && appleClientSecret) {
  providers.push(
    Apple({
      clientId: appleClientId,
      clientSecret: appleClientSecret,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email =
        user.email?.toLowerCase() ||
        (typeof profile?.email === "string"
          ? profile.email.toLowerCase()
          : null);

      return !!email && allowedEmails.has(email);
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
