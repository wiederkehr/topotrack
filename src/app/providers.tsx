"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";

export interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Theme
          accentColor="blue"
          appearance="inherit"
          grayColor="gray"
          panelBackground="solid"
          radius="medium"
        >
          {children}
        </Theme>
      </ThemeProvider>
    </SessionProvider>
  );
}
