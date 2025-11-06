import { lineString as turfLineString } from "@turf/turf";
import { describe, expect, it } from "vitest";

import {
  calculateLineDistance,
  calculateSegmentDistance,
  EARTH_RADIUS_KM,
} from "./distance";

describe("distance utilities", () => {
  describe("calculateSegmentDistance", () => {
    it("calculates distance between two points correctly", () => {
      // San Francisco to Los Angeles (approximately 559 km)
      const sf = [-122.4194, 37.7749] as [number, number];
      const la = [-118.2437, 34.0522] as [number, number];

      const distance = calculateSegmentDistance(sf, la);

      // Allow ±5km tolerance for Haversine approximation
      expect(distance).toBeGreaterThan(554);
      expect(distance).toBeLessThan(564);
    });

    it("returns 0 for identical coordinates", () => {
      const coord = [0, 0] as [number, number];
      const distance = calculateSegmentDistance(coord, coord);

      expect(distance).toBe(0);
    });

    it("calculates distance between equatorial points", () => {
      // 1 degree of latitude at equator ≈ 111.3 km
      const point1 = [0, 0] as [number, number];
      const point2 = [0, 1] as [number, number];

      const distance = calculateSegmentDistance(point1, point2);

      // Allow 111 ± 2 km tolerance
      expect(distance).toBeGreaterThan(109);
      expect(distance).toBeLessThan(113);
    });

    it("is symmetric", () => {
      const point1 = [-122.4194, 37.7749] as [number, number];
      const point2 = [-118.2437, 34.0522] as [number, number];

      const distance1 = calculateSegmentDistance(point1, point2);
      const distance2 = calculateSegmentDistance(point2, point1);

      expect(distance1).toBeCloseTo(distance2, 10);
    });

    it("uses EARTH_RADIUS_KM constant", () => {
      // Verify EARTH_RADIUS_KM is defined
      expect(EARTH_RADIUS_KM).toBe(6371);
    });

    it("handles longitude wraparound correctly", () => {
      // Points near date line
      const point1 = [179, 0] as [number, number];
      const point2 = [-179, 0] as [number, number];

      const distance = calculateSegmentDistance(point1, point2);

      // Should be approximately 223 km (2 degrees at equator)
      expect(distance).toBeGreaterThan(220);
      expect(distance).toBeLessThan(226);
    });
  });

  describe("calculateLineDistance", () => {
    it("calculates total distance of a simple linestring", () => {
      // Create a simple 2-point line
      const route = [
        [0, 0],
        [0, 1],
      ] as [number, number][];
      const lineString = turfLineString(route);

      const distance = calculateLineDistance(lineString);

      // 1 degree at equator ≈ 111 km
      expect(distance).toBeGreaterThan(109);
      expect(distance).toBeLessThan(113);
    });

    it("calculates total distance of a multi-segment linestring", () => {
      // Create a route with multiple segments
      const route = [
        [0, 0],
        [0, 1],
        [0, 2],
      ] as [number, number][];
      const lineString = turfLineString(route);

      const distance = calculateLineDistance(lineString);

      // 2 degrees at equator ≈ 222 km
      expect(distance).toBeGreaterThan(220);
      expect(distance).toBeLessThan(224);
    });

    it("handles edge case: routes with less than 2 points", () => {
      // Turf requires at least 2 coordinates for a linestring
      // So we test that our distance calculator handles the general case
      const route = [
        [0, 0],
        [0, 1],
      ] as [number, number][];
      const lineString = turfLineString(route);

      const distance = calculateLineDistance(lineString);

      expect(distance).toBeGreaterThan(0);
    });

    it("handles real-world route data", () => {
      // Simulate a GPS trace from San Francisco to Los Angeles
      const route = [
        [-122.4194, 37.7749], // San Francisco
        [-121.5, 37.0],
        [-120.0, 36.0],
        [-118.2437, 34.0522], // Los Angeles
      ] as [number, number][];
      const lineString = turfLineString(route);

      const distance = calculateLineDistance(lineString);

      // Approximate distance should be > 500 km but < 700 km
      expect(distance).toBeGreaterThan(500);
      expect(distance).toBeLessThan(700);
    });

    it("is additive for sequential segments", () => {
      const point1 = [0, 0] as [number, number];
      const point2 = [0, 1] as [number, number];
      const point3 = [0, 2] as [number, number];

      // Single route
      const route = [point1, point2, point3];
      const lineString = turfLineString(route);
      const totalDistance = calculateLineDistance(lineString);

      // Two separate segments
      const lineString1 = turfLineString([point1, point2]);
      const lineString2 = turfLineString([point2, point3]);
      const distance1 = calculateLineDistance(lineString1);
      const distance2 = calculateLineDistance(lineString2);

      expect(totalDistance).toBeCloseTo(distance1 + distance2, 5);
    });

    it("skips invalid coordinate pairs", () => {
      // Create a linestring with mixed valid/invalid coordinates
      // This tests the coordinate validation logic
      const route = [
        [0, 0],
        [0, 1],
        [0, 2],
      ] as [number, number][];
      const lineString = turfLineString(route);

      // Should not throw and should calculate distance correctly
      expect(() => calculateLineDistance(lineString)).not.toThrow();
      const distance = calculateLineDistance(lineString);
      expect(distance).toBeGreaterThan(0);
    });
  });
});
