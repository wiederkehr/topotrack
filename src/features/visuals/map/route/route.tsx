import { lineString, point } from "@turf/turf";
import { memo, useMemo } from "react";

import { Circle } from "@/features/visuals/map/circle";
import { Line } from "@/features/visuals/map/line";

type circleProps = {
  circleColor?: string;
  circleRadius?: number;
  id?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

type RouteProps = {
  data: [number, number][];
  line?: {
    id?: string;
    lineColor?: string;
    lineOpacity?: number;
    lineWidth?: number;
  };
  start?: circleProps;
  stop?: circleProps;
};

/**
 * Route component for rendering a route with a start and stop point on the map.
 */
function RouteComponent({
  data,
  line = {
    id: undefined,
    lineColor: "#FFF",
    lineWidth: 1,
    lineOpacity: 1,
  },
  start,
  stop,
}: RouteProps) {
  const startData = useMemo(() => data[0] || [], [data]);
  const stopData = useMemo(() => data[data.length - 1] || [], [data]);
  const startPointData = useMemo(() => point(startData), [startData]);
  const stopPointData = useMemo(() => point(stopData), [stopData]);
  const lineData = useMemo(() => lineString(data ? data : []), [data]);
  return (
    <>
      <Line
        id={line.id}
        data={lineData}
        lineColor={line.lineColor}
        lineOpacity={line.lineOpacity}
        lineWidth={line.lineWidth}
      />
      {start && (
        <Circle
          id={start.id}
          data={startPointData}
          circleRadius={start.circleRadius}
          circleColor={start.circleColor}
          strokeColor={start.strokeColor}
          strokeWidth={start.strokeWidth}
        />
      )}
      {stop && (
        <Circle
          id={stop.id}
          data={stopPointData}
          circleRadius={stop.circleRadius}
          circleColor={stop.circleColor}
          strokeColor={stop.strokeColor}
          strokeWidth={stop.strokeWidth}
        />
      )}
    </>
  );
}

const Route = memo(RouteComponent);
export { Route };
