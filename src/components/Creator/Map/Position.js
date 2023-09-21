import { point } from "@turf/turf";
import { Source, Layer } from "react-map-gl";

export default function Position({ data, color }) {
  return (
    <Source type="geojson" data={point(data)}>
      <Layer
        type="circle"
        paint={{
          "circle-color": color,
        }}
      />
    </Source>
  );
}
