import { FormatNameType } from "@/types";

function getPadding(format: FormatNameType) {
  const defaultPaddingTop = 50;
  const defaultPaddingBottom = 50;
  const defaultPaddingLeft = 50;
  const defaultPaddingRight = 50;
  const formatPadding: Record<string, { bottom: number; top: number }> = {
    Square: { top: defaultPaddingTop, bottom: defaultPaddingBottom },
    Portrait: { top: defaultPaddingTop, bottom: defaultPaddingBottom },
    Story: { top: 250, bottom: 250 },
    Landscape: { top: defaultPaddingTop, bottom: defaultPaddingBottom },
  };
  return {
    top: defaultPaddingTop,
    bottom: defaultPaddingBottom,
    left: defaultPaddingLeft,
    right: defaultPaddingRight,
    ...formatPadding[format],
  };
}

export { getPadding };
