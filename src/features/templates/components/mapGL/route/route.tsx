import { lineString } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

type RouteProps = {
  data: [number, number][];
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
};

function Route({
  data,
  lineColor = "#FFF",
  lineWidth = 1,
  lineOpacity = 1,
}: RouteProps) {
  return (
    <Source type="geojson" data={lineString(data)}>
      <Layer
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": lineColor,
          "line-width": lineWidth,
          "line-opacity": lineOpacity,
        }}
      />
    </Source>
  );
}

export { Route };
