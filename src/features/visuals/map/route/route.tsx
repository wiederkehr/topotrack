import { lineString } from "@turf/turf";
import { memo, useMemo } from "react";
import { Layer, Source } from "react-map-gl";

type RouteProps = {
  data: [number, number][];
  id: string; // Stable ID for the source/layer
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
};

function RouteComponent({
  data,
  id,
  lineColor = "#FFF",
  lineWidth = 1,
  lineOpacity = 1,
}: RouteProps) {
  // Memoize GeoJSON to avoid recreating on every render
  const geojson = useMemo(() => lineString(data), [data]);

  return (
    <Source id={`route-source-${id}`} type="geojson" data={geojson}>
      <Layer
        id={`route-layer-${id}`}
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

// Memoize the component to prevent unnecessary re-renders
const Route = memo(RouteComponent);

export { Route };
