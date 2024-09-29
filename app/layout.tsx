import type { Metadata } from "next";

import Providers from "@/app/providers";

import "@radix-ui/themes/styles.css";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Topotrack",
  description: "Application to generate visuals from Strava activities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
