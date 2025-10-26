import { bbox, bboxPolygon, lineString } from "@turf/turf";
import { memo, useMemo } from "react";
import { Layer, Source } from "react-map-gl";

type RouteBoundsProps = {
  data: [number, number][];
};

function RouteBoundsComponent({ data }: RouteBoundsProps) {
  const boundsData = useMemo(() => bboxPolygon(bbox(lineString(data))), [data]);
  return (
    <Source type="geojson" data={boundsData}>
      <Layer
        type="line"
        layout={{
          "line-join": "miter",
          "line-cap": "square",
        }}
        paint={{
          "line-color": "#f55",
          "line-width": 1,
        }}
      />
    </Source>
  );
}
const RouteBounds = memo(RouteBoundsComponent);
export { RouteBounds };
