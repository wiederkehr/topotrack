import "@/styles/index.css";

import { clsx } from "clsx";
import type { Metadata } from "next";

import Providers from "@/app/providers";
import { condensed, sans } from "@/fonts";

export const metadata: Metadata = {
  title: "Topotrack",
  description: "Generate beautiful visuals from Strava activities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(sans.variable, condensed.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
