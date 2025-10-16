import { along, length } from "@turf/turf";
import type { Map } from "mapbox-gl";

import { computeCameraPosition } from "./computeCameraPosition";
import type { PositionType } from "./types";

type FollowPathProps = {
  altitude: number;
  bearing: number;
  duration: number;
  map: Map;
  onUpdate?: (position: PositionType) => void;
  path: GeoJSON.Feature<GeoJSON.LineString>;
  pitch: number;
};

function followPath({
  map,
  duration,
  path,
  altitude,
  bearing,
  pitch,
  onUpdate,
}: FollowPathProps): Promise<void> {
  return new Promise((resolve) => {
    let startTime: number | undefined;
    let currentAltitude: number;
    let currentBearing: number;
    let currentPitch: number;

    // Calculate the total distance of the path
    const totalDistance = length(path);

    function frame(currentTime: number) {
      // Set start time
      if (!startTime) startTime = currentTime;

      // Calculate progress
      const progress = (currentTime - startTime) / duration;
      const easedProgress = Math.min(progress, 1);

      // Interpolate values
      currentAltitude = altitude;
      currentBearing = bearing;
      currentPitch = pitch;

      // Compute new camera position along the path
      const alongPath = along(path, totalDistance * easedProgress);
      const cameraPosition = computeCameraPosition({
        targetPosition: {
          lng: alongPath.geometry.coordinates[0] as number,
          lat: alongPath.geometry.coordinates[1] as number,
        },
        altitude: currentAltitude,
        bearing: currentBearing,
        pitch: currentPitch,
      });

      // Set camera position
      map.setCenter([cameraPosition.lng, cameraPosition.lat]);
      map.setBearing(currentBearing);
      map.setPitch(currentPitch);

      // Call onUpdate if provided
      if (onUpdate) {
        onUpdate({ lng: cameraPosition.lng, lat: cameraPosition.lat });
      }

      // Continue animation or resolve promise
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

export { followPath };
