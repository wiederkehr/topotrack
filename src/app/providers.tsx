"use client";

import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          provider: () => new Map(),
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
        >
          <Theme
            accentColor="blue"
            grayColor="gray"
            panelBackground="solid"
            scaling="100%"
            radius="medium"
          >
            {children}
          </Theme>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
