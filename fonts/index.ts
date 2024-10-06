import { IBM_Plex_Sans } from "next/font/google";

export const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "700"],
});
