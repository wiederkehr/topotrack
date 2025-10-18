import { ReactNode } from "react";

type SVGContainerProps = {
  children: ReactNode;
  height: number;
  width: number;
};

function SVGContainer({ children, height, width }: SVGContainerProps) {
  const viewbox = `0 0 ${width} ${height}`;
  return <svg viewBox={viewbox}>{children}</svg>;
}

export { SVGContainer };
