import chroma from "chroma-js";

import { SVGContainer, SVGProfile } from "../svg";

type ProfileProps = {
  color: string;
  data: number[];
  height: number;
  width: number;
};

export function Profile({ height, width, color, data }: ProfileProps) {
  return (
    <SVGContainer width={width} height={height}>
      <SVGProfile
        data={data}
        height={height}
        width={width}
        strokeColor={color}
        strokeWidth={2}
        fillGradient={{
          startColor: chroma(color).alpha(0.4).hex(),
          endColor: chroma(color).alpha(0.0).hex(),
        }}
      />
    </SVGContainer>
  );
}
