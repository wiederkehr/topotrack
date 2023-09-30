import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
