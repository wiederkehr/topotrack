import { point } from "@turf/turf";
import { memo, useMemo } from "react";
import { Layer, Source } from "react-map-gl";

type PositionProps = {
  color: string;
  data: [number, number];
};

function PositionComponent({ data, color }: PositionProps) {
  // Memoize GeoJSON to avoid recreating on every render
  const geojson = useMemo(() => point(data), [data]);

  return (
    <Source id="position-source" type="geojson" data={geojson}>
      <Layer
        id="position-layer"
        type="circle"
        paint={{
          "circle-color": color,
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFF",
        }}
      />
    </Source>
  );
}

// Memoize the component to prevent unnecessary re-renders when color doesn't change
const Position = memo(PositionComponent);

export { Position };
