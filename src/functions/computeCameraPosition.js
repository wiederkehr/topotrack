// given a bearing, pitch, altitude, and a targetPosition on the ground to look at,
// calculate the camera's targetPosition as lngLat
let previousCameraPosition;

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

const computeCameraPosition = (
  pitch,
  bearing,
  targetPosition,
  altitude,
  smooth = false
) => {
  var bearingInRadian = bearing / 57.29;
  var pitchInRadian = (90 - pitch) / 57.29;

  var lngDiff =
    ((altitude / Math.tan(pitchInRadian)) * Math.sin(-bearingInRadian)) / 70000; // ~70km/degree longitude
  var latDiff =
    ((altitude / Math.tan(pitchInRadian)) * Math.cos(-bearingInRadian)) /
    110000; // 110km/degree latitude

  var correctedLng = targetPosition.lng + lngDiff;
  var correctedLat = targetPosition.lat - latDiff;

  const newCameraPosition = {
    lng: correctedLng,
    lat: correctedLat,
  };

  if (smooth) {
    if (previousCameraPosition) {
      const SMOOTH_FACTOR = 0.95;
      newCameraPosition.lng = lerp(
        newCameraPosition.lng,
        previousCameraPosition.lng,
        SMOOTH_FACTOR
      );
      newCameraPosition.lat = lerp(
        newCameraPosition.lat,
        previousCameraPosition.lat,
        SMOOTH_FACTOR
      );
    }
  }

  previousCameraPosition = newCameraPosition;

  return newCameraPosition;
};

export default computeCameraPosition;
