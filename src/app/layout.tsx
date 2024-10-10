import "@/styles/index.css";

import type { Metadata } from "next";

import Providers from "@/app/providers";
import { sans } from "@/fonts";

export const metadata: Metadata = {
  title: "Topotrack",
  description: "Generate beautiful visuals from Strava activities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={sans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
