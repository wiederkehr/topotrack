import { point } from "@turf/turf";
import { Layer, Source } from "react-map-gl";

type PositionProps = {
  color: string;
  data: [number, number];
};

function Position({ data, color }: PositionProps) {
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

export { Position };
