import { Theme } from "@radix-ui/themes";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Theme>
          <Main />
        </Theme>
        <NextScript />
      </body>
    </Html>
  );
}
