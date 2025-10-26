import { lineString } from "@turf/turf";
import { describe, expect, it } from "vitest";

import {
  calculateFitBoundsState,
  calculateFlyToState,
  calculateFollowPathState,
} from "./phaseCalculators";
import type { CameraState } from "./types";

describe("phaseCalculators", () => {
  describe("calculateFlyToState", () => {
    const params = {
      startAltitude: 10000,
      stopAltitude: 4000,
      startBearing: 0,
      stopBearing: 90,
      startPitch: 0,
      stopPitch: 60,
      targetLng: -122.4194,
      targetLat: 37.7749,
    };

    it("should return start state at timestamp 0", () => {
      const state = calculateFlyToState(0, 2000, params);

      expect(state.altitude).toBe(10000);
      expect(state.bearing).toBe(0);
      expect(state.pitch).toBe(0);
      expect(state.lng).toBe(-122.4194);
      expect(state.lat).toBe(37.7749);
    });

    it("should return end state at timestamp = duration", () => {
      const state = calculateFlyToState(2000, 2000, params);

      expect(state.altitude).toBe(4000);
      expect(state.bearing).toBe(90);
      expect(state.pitch).toBe(60);
    });

    it("should interpolate smoothly at midpoint", () => {
      const state = calculateFlyToState(1000, 2000, params);

      // With cubic easing, midpoint won't be exactly halfway
      expect(state.altitude).toBeGreaterThan(4000);
      expect(state.altitude).toBeLessThan(10000);
      expect(state.bearing).toBeGreaterThan(0);
      expect(state.bearing).toBeLessThan(90);
    });

    it("should handle bearing wrap-around (350° to 10°)", () => {
      const wrappedParams = {
        ...params,
        startBearing: 350,
        stopBearing: 10,
      };

      const state = calculateFlyToState(1000, 2000, wrappedParams);

      // Should go through 0°, not through 180°
      // At midpoint, bearing should be around 0-10° (wrapped)
      expect(state.bearing).toBeGreaterThan(0);
      expect(state.bearing).toBeLessThan(15);
    });

    it("should clamp progress at 1.0 for timestamps beyond duration", () => {
      const state = calculateFlyToState(3000, 2000, params);

      expect(state.altitude).toBe(4000);
      expect(state.bearing).toBe(90);
      expect(state.pitch).toBe(60);
    });
  });

  describe("calculateFollowPathState", () => {
    const path = lineString([
      [0, 0],
      [0.01, 0],
      [0.02, 0.01],
      [0.03, 0],
    ]);

    const params = {
      path,
      altitude: 4000,
      pitch: 60,
      lookAheadDistance: 0.005,
      bearingDamping: 0.9,
    };

    it("should return start position at timestamp 0", () => {
      const state = calculateFollowPathState(0, 6000, params);

      expect(state.lng).toBeCloseTo(0, 5);
      expect(state.lat).toBeCloseTo(0, 5);
      expect(state.altitude).toBe(4000);
      expect(state.pitch).toBe(60);
    });

    it("should return end position at timestamp = duration", () => {
      const state = calculateFollowPathState(6000, 6000, params);

      expect(state.lng).toBeCloseTo(0.03, 5);
      expect(state.lat).toBeCloseTo(0, 5);
    });

    it("should progress along path at midpoint", () => {
      const state = calculateFollowPathState(3000, 6000, params);

      expect(state.lng).toBeGreaterThan(0);
      expect(state.lng).toBeLessThan(0.03);
    });

    it("should calculate bearing based on path direction", () => {
      const state = calculateFollowPathState(0, 6000, params);

      // Path goes east initially, so bearing should be close to 90°
      expect(state.bearing).toBeGreaterThan(45);
      expect(state.bearing).toBeLessThan(135);
    });

    it("should apply bearing damping across frames", () => {
      const state1 = calculateFollowPathState(0, 6000, params);
      const state2 = calculateFollowPathState(
        100,
        6000,
        params,
        state1.bearing,
      );

      // With damping, bearing shouldn't change drastically
      const bearingChange = Math.abs(state2.bearing - state1.bearing);
      expect(bearingChange).toBeLessThan(45); // Smooth transition
    });

    it("should maintain constant altitude and pitch", () => {
      const states = [0, 1000, 3000, 6000].map((t) =>
        calculateFollowPathState(t, 6000, params),
      );

      states.forEach((state) => {
        expect(state.altitude).toBe(4000);
        expect(state.pitch).toBe(60);
      });
    });
  });

  describe("calculateFitBoundsState", () => {
    const params = {
      boundsWest: -122.5,
      boundsEast: -122.3,
      boundsSouth: 37.7,
      boundsNorth: 37.9,
      bearing: 0,
      pitch: 0,
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 50,
      paddingRight: 50,
    };

    const startState: CameraState = {
      lng: -122.4,
      lat: 37.8,
      altitude: 4000,
      bearing: 90,
      pitch: 60,
    };

    it("should return start state at timestamp 0", () => {
      const state = calculateFitBoundsState(0, 2000, params, startState);

      expect(state.lng).toBeCloseTo(startState.lng);
      expect(state.lat).toBeCloseTo(startState.lat);
      expect(state.altitude).toBeCloseTo(startState.altitude);
      expect(state.bearing).toBe(startState.bearing);
      expect(state.pitch).toBe(startState.pitch);
    });

    it("should move toward bounds center", () => {
      const centerLng = (params.boundsWest + params.boundsEast) / 2;
      const centerLat = (params.boundsSouth + params.boundsNorth) / 2;

      const state = calculateFitBoundsState(2000, 2000, params, startState);

      expect(state.lng).toBeCloseTo(centerLng);
      expect(state.lat).toBeCloseTo(centerLat);
    });

    it("should increase altitude to fit bounds", () => {
      const state = calculateFitBoundsState(2000, 2000, params, startState);

      expect(state.altitude).toBeGreaterThan(startState.altitude);
    });

    it("should return to flat view (pitch 0, bearing 0)", () => {
      const state = calculateFitBoundsState(2000, 2000, params, startState);

      expect(state.bearing).toBe(0);
      expect(state.pitch).toBe(0);
    });

    it("should interpolate smoothly at midpoint", () => {
      const state = calculateFitBoundsState(1000, 2000, params, startState);

      expect(state.altitude).toBeGreaterThan(startState.altitude);
      expect(state.bearing).toBeGreaterThan(0);
      expect(state.bearing).toBeLessThan(90);
      expect(state.pitch).toBeGreaterThan(0);
      expect(state.pitch).toBeLessThan(60);
    });
  });
});
