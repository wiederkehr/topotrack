import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import StravaProvider from "next-auth/providers/strava";

import { refreshAccessToken } from "@/functions/refreshAccessToken";

// Add access_token to the Session type.
declare module "next-auth" {
  interface Session {
    access_token: string;
    error?: string;
  }
}

// Add custom fields to the JWT type.
declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    error?: string;
    expires_at?: number;
    refresh_token?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // Configure Strava authentication provider with correct scope
  providers: [
    StravaProvider({
      authorization: {
        params: {
          scope: "read,activity:read",
        },
      },
    }),
  ],
  // Use JWT-based persistent sessions (this is the default configuration)
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  // Configure the JWT behavior (this is the default configuration)
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at ?? 0,
        };
      }
      // If the token is valid, return it
      if (Date.now() < (token.expires_at ?? 0)) {
        return token;
      }
      // If the token is expired, refresh it
      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      if (token) {
        session.access_token = token.access_token as string;
      }
      return session;
    },
  },
});
