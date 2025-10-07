import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables
   * Only available in server components and API routes
   */
  server: {
    AUTH_SECRET: z.string().min(1),
    AUTH_STRAVA_ID: z.string().min(1),
    AUTH_STRAVA_SECRET: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  /**
   * Client-side environment variables
   * Exposed to the browser (must be prefixed with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1),
  },

  /**
   * Runtime environment variables
   * Read from process.env
   */
  runtimeEnv: {
    // Server
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_STRAVA_ID: process.env.AUTH_STRAVA_ID,
    AUTH_STRAVA_SECRET: process.env.AUTH_STRAVA_SECRET,
    NODE_ENV: process.env.NODE_ENV,

    // Client
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },

  /**
   * Skip validation during build (optional)
   * Set to true for Docker builds or CI where env vars may not be available
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
