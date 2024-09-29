import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";

declare module "next-auth" {
  interface Session {
    access_token: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Strava],
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
        session.user.id = user.id as string;
      }
      return session;
    },
  },
});
