import { ReactNode } from "react";

type SVGGroupProps = {
  children: ReactNode;
  style?: React.CSSProperties;
  transform: string;
};

function SVGGroup({ children, transform, style }: SVGGroupProps) {
  return (
    <g transform={transform} style={style}>
      {children}
    </g>
  );
}

export { SVGGroup };
