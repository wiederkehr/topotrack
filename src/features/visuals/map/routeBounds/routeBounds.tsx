import { bbox, bboxPolygon, lineString } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

type RouteBoundsProps = {
  data: [number, number][];
};

function RouteBounds({ data }: RouteBoundsProps) {
  const routeLineString = lineString(data);
  const routeBbox = bbox(routeLineString);
  const boundsPolygon = bboxPolygon(routeBbox);

  return (
    <Source type="geojson" data={boundsPolygon}>
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

export { RouteBounds };
