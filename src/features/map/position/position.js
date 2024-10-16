import { point } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

export default function MapPosition({ data, color }) {
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
