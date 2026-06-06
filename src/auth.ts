// Auth.js (NextAuth v5) configuration.
// -----------------------------------------------------------------------------
// Credentials-based demo authentication. The app is intentionally NOT gated —
// every page remains viewable without logging in so the portfolio can be
// reviewed freely — but a working sign-in flow is wired up at /login.
//
// In production, replace the demo check in `authorize` with a Prisma lookup:
//   const user = await prisma.user.findUnique({ where: { email } })
//   then verify the password against user.passwordHash (see verifyPassword).

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { scryptSync, timingSafeEqual } from "node:crypto";

/** Verify a plaintext password against a `salt:hash` (hex) string. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const derived = scryptSync(password, salt, hashBuffer.length);
  return (
    hashBuffer.length === derived.length && timingSafeEqual(hashBuffer, derived)
  );
}

const DEMO_EMAIL = process.env.AUTH_DEMO_EMAIL ?? "admin@nexus-crm.jp";
const DEMO_PASSWORD = process.env.AUTH_DEMO_PASSWORD ?? "demo1234";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // Demo fallback so the app works without a database connected.
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          return { id: "demo-admin", name: "田中 管理者", email };
        }

        return null;
      },
    }),
  ],
});
