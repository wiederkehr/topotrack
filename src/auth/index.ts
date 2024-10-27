import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";

// Add access_token to the Session type.
declare module "next-auth" {
  interface Session {
    access_token: string;
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
    session({ session, token }) {
      if (token) {
        session.access_token = token.access_token as string;
      }
      return session;
    },
  },
});
