import { along, lineDistance } from "@turf/turf";
import { Map } from "mapbox-gl";

import computeCameraPosition from "./computeCameraPosition";

type FollowPathProps = {
  altitude: number;
  bearing: number;
  duration: number;
  map: Map;
  onUpdate?: (position: { lat: number; lng: number }) => void;
  path: any;
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
  return new Promise(async (resolve) => {
    let startTime: number | undefined;
    let currentAltitude: number;
    let currentBearing: number;
    let currentPitch: number;

    const totalDistance = lineDistance(path);

    async function frame(currentTime: number) {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Calculate progress
      const progress = (currentTime - startTime) / duration;
      const easedProgress = Math.min(progress, 1);

      // Interpolate values
      currentAltitude = altitude;
      currentBearing = bearing;
      currentPitch = pitch;

      // Compute new camera position
      const alongPath = along(path, totalDistance * easedProgress);
      const cameraPosition = computeCameraPosition({
        targetPosition: {
          lng: alongPath.geometry.coordinates[0],
          lat: alongPath.geometry.coordinates[1],
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

export default followPath;
