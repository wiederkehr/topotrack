import { lineString } from "@turf/turf";
import { Source, Layer } from "react-map-gl";

export default function Route({ data, color }) {
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
