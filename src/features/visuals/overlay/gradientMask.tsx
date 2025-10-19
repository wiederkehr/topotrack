import { Box } from "@radix-ui/themes";
import chroma from "chroma-js";

import { toPx } from "@/functions/toPx";

type GradientMaskProps = {
  color: string;
  height: number;
  position: "top" | "bottom";
};

function GradientMask({ height, position, color }: GradientMaskProps) {
  let style;
  switch (position) {
    case "top":
      style = `linear-gradient(${chroma(color).alpha(1).css()} 66%, ${chroma(color).alpha(0).css()} 100%)`;
      break;
    case "bottom":
      style = `linear-gradient(${chroma(color).alpha(0).css()} 0%, ${chroma(color).alpha(1).css()} 33%)`;
      break;
    default:
      break;
  }
  return (
    <Box
      position="absolute"
      top={position === "top" ? "0" : undefined}
      bottom={position === "bottom" ? "0" : undefined}
      left="0"
      right="0"
      height={toPx(height)}
      style={{
        background: style,
      }}
    />
  );
}

export { GradientMask };
