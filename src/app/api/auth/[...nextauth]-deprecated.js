import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read,activity:read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = {
        name: token.name,
        picture: token.picture,
        id: token.sub,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
