import type { User } from "next-auth";
import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";

// Add access_token to the Session type and id to User type.
declare module "next-auth" {
  interface Session {
    access_token: string;
    user: {
      id: string;
    } & User;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Strava({
      authorization: {
        params: {
          scope: "read,activity:read",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token as string;
      }
      return token;
    },
    session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token as string;
      }
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
