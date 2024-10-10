import { along, lineDistance, lineSliceAlong } from "@turf/turf";
import { max } from "d3";
import { MercatorCoordinate } from "mapbox-gl";

import computeCameraPosition from "@/functions/map/computeCameraPosition";

const followPath = async ({
  map,
  duration,
  path,
  altitude,
  bearing,
  pitch,
  onUpdate,
}) => {
  return new Promise(async (resolve) => {
    let startTime;
    let currentAltitude;
    let currentBearing;
    let currentPitch;

    const totalDistance = lineDistance(path);

    const frame = async (currentTime) => {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Compute animation phase
      let animationPhase = (currentTime - startTime) / duration;
      // Fix animation to maximum 1
      if (animationPhase > 1) animationPhase = 1;

      // Compute current distance
      const currentDistance = totalDistance * animationPhase;
      // Compute current position along path
      const pointAlongPath = along(path, currentDistance);
      // Compute section to current position along path
      const lineAlongPath = lineSliceAlong(
        path,
        0,
        max([0.001, currentDistance]),
      );
      // Set position of progress point
      const targetPosition = {
        lng: pointAlongPath.geometry.coordinates[0],
        lat: pointAlongPath.geometry.coordinates[1],
      };
      // Rotate camera bearing
      currentBearing = bearing - animationPhase * 200.0;
      currentAltitude = altitude;
      currentPitch = pitch;

      // Compute corrected camera position, so the leading edge of the path is always in view
      const correctedPosition = computeCameraPosition({
        targetPosition: targetPosition,
        altitude: currentAltitude,
        bearing: currentBearing,
        pitch: currentPitch,
        smooth: true,
      });
      // Set corrected pitch and bearing of camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(currentPitch, currentBearing);
      // Set corrected position and altitude of camera
      camera.position = MercatorCoordinate.fromLngLat(
        correctedPosition,
        currentAltitude,
      );

      onUpdate({
        pointData: pointAlongPath.geometry.coordinates,
        lineData: lineAlongPath.geometry.coordinates,
      });

      // Set corrected camera options
      map.setFreeCameraOptions(camera);

      // End animation after duration and return current bearing, altitude, and pitch
      if (animationPhase === 1) {
        resolve({
          altitude: currentAltitude,
          bearing: currentBearing,
          pitch: currentPitch,
        });
        return;
      }
      window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  });
};

export default followPath;
