import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "@/styles/index.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Theme
          accentColor="blue"
          appearance="inherit"
          grayColor="gray"
          panelBackground="solid"
          scaling="100%"
          radius="medium"
        >
          <Component {...pageProps} />
        </Theme>
      </ThemeProvider>
    </SessionProvider>
  );
}
