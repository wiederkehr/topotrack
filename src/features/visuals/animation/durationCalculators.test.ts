import { describe, expect, it } from "vitest";

import {
  calculateFitBoundsDuration,
  calculateFlyToDuration,
  calculateFollowPathDuration,
  calculateTotalDuration,
} from "./durationCalculators";

describe("durationCalculators", () => {
  describe("calculateFlyToDuration", () => {
    it("should return fixed duration of 2000ms", () => {
      expect(calculateFlyToDuration()).toBe(2000);
    });
  });

  describe("calculateFitBoundsDuration", () => {
    it("should return fixed duration of 2000ms", () => {
      expect(calculateFitBoundsDuration()).toBe(2000);
    });
  });

  describe("calculateFollowPathDuration", () => {
    it("should return minimum duration for very short route", () => {
      // Very short straight route (0.1km)
      const shortRoute: [number, number][] = [
        [0, 0],
        [0.001, 0],
      ];
      const duration = calculateFollowPathDuration(shortRoute);
      expect(duration).toBe(4000); // Clamped to minimum
    });

    it("should scale duration with route length", () => {
      // Straight route ~5km
      const mediumRoute: [number, number][] = [
        [0, 0],
        [0.05, 0],
      ];
      const duration = calculateFollowPathDuration(mediumRoute);
      expect(duration).toBeGreaterThan(4000);
      expect(duration).toBeLessThan(8000);
    });

    it("should increase duration for complex routes", () => {
      // Zigzag route (same length but more complex)
      const complexRoute: [number, number][] = [
        [0, 0],
        [0.01, 0.01],
        [0.02, 0],
        [0.03, 0.01],
        [0.04, 0],
        [0.05, 0.01],
      ];
      const straightRoute: [number, number][] = [
        [0, 0],
        [0.05, 0.01],
      ];

      const complexDuration = calculateFollowPathDuration(complexRoute);
      const straightDuration = calculateFollowPathDuration(straightRoute);

      expect(complexDuration).toBeGreaterThan(straightDuration);
    });

    it("should cap duration at maximum for very long routes", () => {
      // Very long route (100km)
      const longRoute: [number, number][] = [
        [0, 0],
        [1, 0],
      ];
      const duration = calculateFollowPathDuration(longRoute);
      expect(duration).toBe(15000); // Clamped to maximum
    });
  });

  describe("calculateTotalDuration", () => {
    it("should sum all phase durations", () => {
      const route: [number, number][] = [
        [0, 0],
        [0.05, 0],
      ];

      const total = calculateTotalDuration(route);
      const expected =
        calculateFlyToDuration() +
        calculateFollowPathDuration(route) +
        calculateFitBoundsDuration();

      expect(total).toBe(expected);
    });

    it("should be at least 8 seconds for any route", () => {
      // Minimum: 2s (flyTo) + 4s (followPath min) + 2s (fitBounds) = 8s
      const route: [number, number][] = [
        [0, 0],
        [0.001, 0],
      ];
      expect(calculateTotalDuration(route)).toBeGreaterThanOrEqual(8000);
    });

    it("should be at most 19 seconds for any route", () => {
      // Maximum: 2s (flyTo) + 15s (followPath max) + 2s (fitBounds) = 19s
      const route: [number, number][] = [
        [0, 0],
        [2, 0],
      ];
      expect(calculateTotalDuration(route)).toBeLessThanOrEqual(19000);
    });
  });
});
