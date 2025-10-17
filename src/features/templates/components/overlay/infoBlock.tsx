import { Box } from "@radix-ui/themes";

type InfoBlockProps = {
  children: React.ReactNode;
  padding: { bottom: number; left: number; right: number; top: number };
  position: "top" | "bottom";
};

function toPixel(number: number): string {
  return number.toString() + "px";
}

export function InfoBlock({ padding, position, children }: InfoBlockProps) {
  return (
    <Box
      position={"absolute"}
      bottom={position === "bottom" ? toPixel(padding.bottom) : undefined}
      top={position === "top" ? toPixel(padding.top) : undefined}
      left={toPixel(padding.left)}
      right={toPixel(padding.right)}
    >
      {children}
    </Box>
  );
}
