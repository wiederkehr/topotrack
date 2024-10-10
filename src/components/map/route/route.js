import { lineString } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

export default function MapRoute({ data, color }) {
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
