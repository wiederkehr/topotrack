import { Box } from "@radix-ui/themes";

import { toPx } from "@/functions/toPx";

type InfoBlockProps = {
  children: React.ReactNode;
  padding: { bottom: number; left: number; right: number; top: number };
  position: "top" | "bottom";
};

export function InfoBlock({ padding, position, children }: InfoBlockProps) {
  return (
    <Box
      position={"absolute"}
      bottom={position === "bottom" ? toPx(padding.bottom) : undefined}
      top={position === "top" ? toPx(padding.top) : undefined}
      left={toPx(padding.left)}
      right={toPx(padding.right)}
    >
      {children}
    </Box>
  );
}
