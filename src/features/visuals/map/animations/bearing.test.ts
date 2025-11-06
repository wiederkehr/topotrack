import { describe, expect, it } from "vitest";

import { calculateBearing, dampBearing } from "./bearing";

describe("bearing utilities", () => {
  describe("calculateBearing", () => {
    it("calculates bearing north correctly", () => {
      // Moving north (from equator towards north pole)
      const from = [0, 0] as [number, number];
      const to = [0, 1] as [number, number];

      const bearing = calculateBearing(from, to);

      // Should be approximately 0 degrees (north)
      expect(bearing).toBeCloseTo(0, 0);
    });

    it("calculates bearing east correctly", () => {
      // Moving east at equator
      const from = [0, 0] as [number, number];
      const to = [1, 0] as [number, number];

      const bearing = calculateBearing(from, to);

      // Should be approximately 90 degrees (east)
      expect(bearing).toBeCloseTo(90, 0);
    });

    it("calculates bearing south correctly", () => {
      // Moving south (from equator towards south pole)
      const from = [0, 1] as [number, number];
      const to = [0, 0] as [number, number];

      const bearing = calculateBearing(from, to);

      // Should be approximately 180 degrees (south)
      expect(bearing).toBeCloseTo(180, 0);
    });

    it("calculates bearing west correctly", () => {
      // Moving west at equator
      const from = [1, 0] as [number, number];
      const to = [0, 0] as [number, number];

      const bearing = calculateBearing(from, to);

      // Turf may return -90 or 270 for west, normalize to 0-360
      const normalizedBearing = bearing < 0 ? bearing + 360 : bearing;
      expect(normalizedBearing).toBeCloseTo(270, 0);
    });

    it("returns bearing in 0-360 range", () => {
      // Test various points
      const testCases = [
        { from: [0, 0], to: [1, 1] },
        { from: [-122, 37], to: [-118, 34] },
        { from: [179, 0], to: [-179, 0] },
      ];

      for (const testCase of testCases) {
        const bearing = calculateBearing(
          testCase.from as [number, number],
          testCase.to as [number, number],
        );
        expect(bearing).toBeGreaterThanOrEqual(0);
        expect(bearing).toBeLessThan(360);
      }
    });

    it("is antisymmetric (opposite bearing)", () => {
      const from = [0, 0] as [number, number];
      const to = [1, 1] as [number, number];

      const bearing1 = calculateBearing(from, to);
      let bearing2 = calculateBearing(to, from);

      // Normalize negative bearings to 0-360
      if (bearing2 < 0) bearing2 += 360;

      // bearing2 should be bearing1 + 180 (mod 360)
      const expectedBearing2 = (bearing1 + 180) % 360;
      expect(bearing2).toBeCloseTo(expectedBearing2, 0);
    });

    it("handles identical points gracefully", () => {
      const from = [0, 0] as [number, number];
      const to = [0, 0] as [number, number];

      // Should not throw
      expect(() => calculateBearing(from, to)).not.toThrow();
      const bearing = calculateBearing(from, to);
      expect(typeof bearing).toBe("number");
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    });

    it("handles antipodal points", () => {
      // Antipodal points (opposite sides of Earth)
      const from = [0, 0] as [number, number];
      const to = [0, -90] as [number, number];

      expect(() => calculateBearing(from, to)).not.toThrow();
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    });
  });

  describe("dampBearing", () => {
    it("converges towards target bearing with high damping", () => {
      let bearing = 0;
      const target = 90;
      const damping = 0.95;
      const deltaTime = 16.67;

      // Apply damping multiple times
      for (let i = 0; i < 100; i++) {
        bearing = dampBearing(bearing, target, damping, deltaTime);
      }

      // Should be very close to target bearing
      expect(bearing).toBeCloseTo(target, 1);
    });

    it("responds quickly with low damping", () => {
      const currentBearing = 0;
      const targetBearing = 90;

      const bearing1 = dampBearing(currentBearing, targetBearing, 0.1, 16.67);
      const bearing2 = dampBearing(currentBearing, targetBearing, 0.9, 16.67);

      // Lower damping (0.1) should move faster towards target
      expect(bearing1).toBeGreaterThan(bearing2);
    });

    it("normalizes bearing to 0-360 range", () => {
      const testCases = [
        { current: 0, target: 180, damping: 0.5 },
        { current: 350, target: 10, damping: 0.5 },
        { current: 180, target: -180, damping: 0.5 },
      ];

      for (const testCase of testCases) {
        const result = dampBearing(
          testCase.current,
          testCase.target,
          testCase.damping,
          16.67,
        );
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(360);
      }
    });

    it("takes shortest path across 0 degrees", () => {
      // When going from 350 to 10, should go +20 (via 360/0), not -340
      let bearing = 350;
      const target = 10;
      const damping = 0.5;

      bearing = dampBearing(bearing, target, damping, 16.67);

      // After one step, bearing should increase (towards 10)
      // instead of going all the way around to 350-340=10
      expect(bearing).toBeGreaterThan(350);
    });

    it("is frame-rate independent with proper deltaTime", () => {
      const currentBearing = 0;
      const targetBearing = 90;
      const damping = 0.5;

      // Two steps with 16.67ms (60fps)
      let bearing1 = currentBearing;
      bearing1 = dampBearing(bearing1, targetBearing, damping, 16.67);
      bearing1 = dampBearing(bearing1, targetBearing, damping, 16.67);

      // One step with 33.34ms (equivalent total time)
      const bearing2 = dampBearing(
        currentBearing,
        targetBearing,
        damping,
        33.34,
      );

      // They should be approximately equal
      expect(bearing1).toBeCloseTo(bearing2, 1);
    });

    it("works with damping value of 0 (instant)", () => {
      const currentBearing = 0;
      const targetBearing = 90;

      const result = dampBearing(currentBearing, targetBearing, 0, 16.67);

      // With damping = 0, should move significantly towards target
      expect(result).toBeGreaterThan(currentBearing);
      expect(result).toBeLessThanOrEqual(targetBearing);
    });

    it("works with damping value of 1 (very slow movement)", () => {
      const currentBearing = 45;
      const targetBearing = 90;

      const result = dampBearing(currentBearing, targetBearing, 1, 16.67);

      // With damping = 1, timeConstant = 100ms
      // At 60fps (16.67ms), factor ≈ 1 - exp(-16.67/100) ≈ 0.16
      // So change ≈ 45 * 0.16 ≈ 7.2 degrees
      expect(result).toBeGreaterThan(currentBearing);
      expect(result).toBeLessThan(targetBearing);
      expect(result - currentBearing).toBeLessThan(10);
    });

    it("handles negative angle differences", () => {
      // Current: 10, Target: 350 (should go backwards -20, not forwards +340)
      let bearing = 10;
      const target = 350;

      bearing = dampBearing(bearing, target, 0.5, 16.67);

      // Should move towards 350 via 0 (decreasing bearing)
      expect(bearing).toBeLessThan(10);
    });

    it("converges monotonically", () => {
      let bearing = 0;
      const target = 180;
      const damping = 0.7;
      const deltaTime = 16.67;

      const bearings = [bearing];

      for (let i = 0; i < 50; i++) {
        bearing = dampBearing(bearing, target, damping, deltaTime);
        bearings.push(bearing);
      }

      // Bearing should monotonically increase towards target
      for (let i = 1; i < bearings.length; i++) {
        const current = bearings[i];
        const previous = bearings[i - 1];
        if (current !== undefined && previous !== undefined) {
          expect(current).toBeGreaterThanOrEqual(previous);
        }
      }

      // Should eventually approach target
      expect(bearings[bearings.length - 1]).toBeCloseTo(target, 1);
    });
  });

  describe("bearing + damping integration", () => {
    it("can animate bearing along a path", () => {
      const waypoints = [
        [0, 0] as [number, number],
        [1, 0] as [number, number],
        [1, 1] as [number, number],
      ];

      let currentBearing = 0;

      for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];
        if (from && to) {
          const targetBearing = calculateBearing(from, to);
          currentBearing = dampBearing(
            currentBearing,
            targetBearing,
            0.5,
            16.67,
          );
        }
      }

      // Should have updated bearing
      expect(currentBearing).not.toBe(0);
      expect(currentBearing).toBeGreaterThanOrEqual(0);
      expect(currentBearing).toBeLessThan(360);
    });
  });
});
