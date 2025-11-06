import { point } from "@turf/turf";
import { memo, useMemo } from "react";

import { Circle } from "@/features/visuals/map/elements/primitives/circle";

type PositionProps = {
  circleColor?: string;
  circleRadius?: number;
  data: [number, number];
  id: string;
  strokeColor?: string;
  strokeWidth?: number;
};

/**
 * Position component for rendering a position point on the map.
 */
function PositionComponent({
  data,
  circleColor = "#FFF",
  circleRadius = 6,
  id,
  strokeColor = "#FFF",
  strokeWidth = 2,
}: PositionProps) {
  const pointData = useMemo(() => point(data), [data]);
  return (
    <Circle
      id={id}
      data={pointData}
      circleColor={circleColor}
      circleRadius={circleRadius}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
}

const Position = memo(PositionComponent);
export { Position };
