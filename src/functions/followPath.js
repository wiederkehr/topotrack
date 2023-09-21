import { lineDistance, along, lineSliceAlong } from "@turf/turf";
import { MercatorCoordinate } from "mapbox-gl";
import { max } from "d3";
import computeCameraPosition from "@/functions/computeCameraPosition";

const followPath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  startPitch,
  onUpdate,
}) => {
  return new Promise(async (resolve) => {
    let startTime;
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
      console.log(currentDistance);
      // Compute current position along path
      const pointAlongPath = along(path, currentDistance);
      // Compute section to current position along path
      const lineAlongPath = lineSliceAlong(
        path,
        0,
        max([0.001, currentDistance])
      );
      // Set position of progress point
      const targetPosition = {
        lng: pointAlongPath.geometry.coordinates[0],
        lat: pointAlongPath.geometry.coordinates[1],
      };
      // Rotate camera bearing
      const currentBearing = startBearing - animationPhase * 200.0;

      // Compute corrected camera position, so the leading edge of the path is always in view
      const correctedPosition = computeCameraPosition(
        startPitch,
        currentBearing,
        targetPosition,
        startAltitude,
        true
      );

      // Set corrected pitch and bearing of camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(startPitch, currentBearing);
      // Set corrected position and altitude of camera
      camera.position = MercatorCoordinate.fromLngLat(
        correctedPosition,
        startAltitude
      );

      onUpdate({
        pointData: pointAlongPath.geometry.coordinates,
        lineData: lineAlongPath.geometry.coordinates,
      });

      // Set corrected camera options
      map.setFreeCameraOptions(camera);

      // End animation after duration and return current bearing, altitude, and pitch
      if (animationPhase === 1) {
        resolve();
        return;
      }
      window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  });
};

export default followPath;
