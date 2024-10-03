import type { Metadata } from "next";

import Providers from "@/app/providers";

import "@/styles/index.css";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "Topotrack",
  description: "Application to generate visuals from Strava activities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
