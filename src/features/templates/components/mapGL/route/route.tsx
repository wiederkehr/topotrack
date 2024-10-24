import { lineString } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

type RouteProps = {
  color: string;
  data: [number, number][];
};

function Route({ data, color }: RouteProps) {
  return (
    <Source type="geojson" data={lineString(data)}>
      <Layer
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": color,
          "line-width": 2,
        }}
      />
    </Source>
  );
}

export { Route };
