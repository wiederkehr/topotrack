import { useState, useRef, useCallback, useEffect } from "react";
import useAnimationFrame from "use-animation-frame";
import { lineString, lineDistance, point, bbox, center } from "@turf/turf";
import { MercatorCoordinate } from "mapbox-gl";
import MapGL from "react-map-gl";
import { max, min } from "d3";
import computeCameraPosition from "@/functions/computeCameraPosition";
import { colors } from "@/styles/constants";
import Position from "./Position";
import Route from "./Route";
import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import flyToPoint from "@/functions/flyToPoint";
import followPath from "@/functions/followPath";

const MAP_STYLE =
  "mapbox://styles/benjaminwiederkehr/clmr134ih01y301rchfii6ey6";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ data }) {
  // Data
  const latlng = data.find((d) => d.type === "latlng").data;
  const lnglat = latlng.map((d) => [d[1], d[0]]);
  // Features
  const routeData = lnglat;
  const routeBound = bbox(lineString(routeData));
  const routeCenter = center(lineString(routeData)).geometry.coordinates;
  const routeSegments = routeData.length;
  const [positionData, setPositionData] = useState(routeData[0]);
  const [progressData, setProgressData] = useState([
    routeData[0],
    routeData[0],
  ]);
  // Map
  const mapStartBearing = 0;
  const mapStopBearing = 0;
  const mapStartPitch = 0;
  const mapStopPitch = 50;
  const mapStartAltitude = 10000;
  const mapStopAltitude = 5000;
  const mapPadding = 32;
  const mapRef = useRef();
  const mapConfig = {
    longitude: routeCenter[0],
    latitude: routeCenter[1],
    bearing: mapStartBearing,
    pitch: mapStartPitch,
    zoom: 10,
  };
  // Animation
  const animationDuration = 10;
  const animationFrameRate = 60;
  const rotationSegments = 360;
  const animationFrames = animationFrameRate * animationDuration;
  const routeIncrement = Math.ceil(routeSegments / animationFrames);
  const rotationIncrement = rotationSegments / animationFrames;
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [routeStep, setRouteStep] = useState(0);
  const [rotationStep, setRotationStep] = useState(0);

  /*
  useAnimationFrame(({ time, delta }) => {
    if (shouldAnimate) {
      if (routeStep + routeIncrement < routeSegments) {
        setRouteStep(routeStep + routeIncrement);
        setRotationStep(rotationStep + rotationIncrement);
      } else {
        setRouteStep(routeSegments - 1);
        // TODO: Make sure the camera rotates 360 degrees
        setRotationStep(rotationSegments);
        setShouldAnimate(false);
      }
      animateProgress();
      followProgress();
    }
  });
  */

  /*
  const animateProgress = () => {
    setPositionData(routeData[min([routeStep, routeData.length])]);
    setProgressData(routeData.slice(0, max([2, routeStep])));
  };
  */

  /*
  const followProgress = () => {
    const camera = mapRef.current?.getFreeCameraOptions();

    const pitch = mapStopPitch;
    const bearing = mapStartBearing; // - rotationStep;
    const altitude = mapStopAltitude;
    const targetPosition = {
      lng: positionData[0],
      lat: positionData[1],
    };

    // Compute camera position, so that the progress point is in view
    const correctedPosition = computeCameraPosition(
      pitch,
      bearing,
      targetPosition,
      altitude,
      true
    );

    // Set pitch and bearing of camera
    camera?.setPitchBearing(pitch, bearing);

    // set the position and altitude of the camera
    camera.position = MercatorCoordinate.fromLngLat(
      correctedPosition,
      altitude
    );

    // apply the new camera options
    mapRef.current?.setFreeCameraOptions(camera);
  };
  */

  /*
  let startTime;
  useAnimationFrame((e) => {
    const currentTime = e.time;
    // ANIMATE CAMERA
    // Set start time to the current time
    if (!startTime) startTime = currentTime;

    // Calculate the current phase of the animation
    const animationPhase = (currentTime - startTime) / (DURATION * 1000);

    // Stop iterating when the duration is complete
    if (animationPhase > 1) {
      return;
    }

    // Get coordinates of the start point (test for progress point)
    const targetPosition = {
      lng: positionData.geometry.coordinates[0],
      lat: positionData.geometry.coordinates[1],
    };

    // Rotate the map at a constant rate
    const bearing = STARTBEARING - animationPhase * 200.0;
    const altitude = 5000;
    const pitch = 50;

    // Compute camera position, so that the progress point is in view
    let correctedPosition = computeCameraPosition(
      pitch, // pitch
      bearing, // bearing
      targetPosition, // coordinates of progress point
      altitude, // altitude
      true // smooth
    );

    // Set pitch and bearing of camera
    const camera = mapRef.current?.getFreeCameraOptions();
    camera?.setPitchBearing(pitch, bearing);

    // set the position and altitude of the camera
    camera.position = MercatorCoordinate.fromLngLat(
      correctedPosition,
      altitude // altitude
    );

    // apply the new camera options
    mapRef.current?.setFreeCameraOptions(camera);

    // ANIMATE POINT AND LINE
    const start = lnglat[animationStep >= routeSegments ? animationStep - 1 : animationStep];
    const end = lnglat[animationStep >= routeSegments ? animationStep : animationStep + 1];
    if (!start || !end) {
      return;
    } else {
      setPositionData(point(lnglat[animationStep]));
      setProgressData(lineString(lnglat.slice(0, max([2, animationStep]))));
      setAnimationStep(animationStep + animationIncrement);
    }
  });
  */

  const onMapLoad = useCallback(async () => {
    const { bearing, altitude, pitch } = await flyToPoint({
      map: mapRef.current,
      targetPosition: {
        lng: positionData[0],
        lat: positionData[1],
      },
      duration: 1000,
      startAltitude: 100000,
      endAltitude: 5000,
      startBearing: -60,
      endBearing: 0,
      startPitch: 20,
      endPitch: 50,
    });

    await followPath({
      map: mapRef.current,
      duration: 10000,
      path: lineString(routeData),
      startBearing: bearing,
      startAltitude: altitude,
      startPitch: pitch,
      onUpdate: ({ pointData, lineData }) => {
        setPositionData(pointData);
        setProgressData(lineData);
      },
    });

    // const centerMapOnRoute = () => {
    //   mapRef.current.once("moveend", () => {
    //     centerMapOnStart();
    //   });
    //   mapRef.current.fitBounds(routeBound, {
    //     pitch: mapStopPitch,
    //     bearing: mapStopBearing,
    //     padding: mapPadding,
    //   });
    // };
    // const centerMapOnStart = () => {
    //   mapRef.current.once("moveend", () => {
    //     setShouldAnimate(true);
    //   });
    //   mapRef.current.easeTo({
    //     center: positionData,
    //   });
    // };
    // centerMapOnRoute();
  }, [routeBound, positionData]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={onMapLoad}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Route data={routeData} color="#fff" />
        <Route data={progressData} color={colors.accent} />
        <Position data={positionData} color={colors.accent} />
      </MapGL>
    </div>
  );
}
