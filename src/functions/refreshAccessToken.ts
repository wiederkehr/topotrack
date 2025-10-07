import axios from "axios";
import type { JWT } from "next-auth/jwt";

type StravaTokenResponse = {
  access_token: string;
  expires_at: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

// Helper to refresh access token when expired
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Check if the refresh token is available
    if (!token.refresh_token) {
      throw new Error("Missing refresh token");
    }

    const response = await axios.post<StravaTokenResponse>(
      "https://www.strava.com/oauth/token",
      null,
      {
        params: {
          client_id: process.env.AUTH_STRAVA_ID,
          client_secret: process.env.AUTH_STRAVA_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refresh_token,
        },
      },
    );

    const refreshedTokens = response.data;

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      expires_at: refreshedTokens.expires_at * 1000, // convert to ms
    };
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { refreshAccessToken };
