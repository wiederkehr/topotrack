import { describe, expect, it } from "vitest";

import { formatDistance } from "./formatDistance";

describe("formatDistance", () => {
  describe("metric", () => {
    it("formats meters to kilometers correctly", () => {
      expect(formatDistance(1000, "metric")).toBe("1 km");
    });

    it("formats with decimals for partial kilometers", () => {
      expect(formatDistance(1500, "metric")).toBe("1.5 km");
    });

    it("formats large distances correctly", () => {
      expect(formatDistance(42195, "metric")).toBe("42.2 km");
    });

    it("handles zero correctly", () => {
      expect(formatDistance(0, "metric")).toBe("0 km");
    });

    it("formats small distances with decimals", () => {
      expect(formatDistance(500, "metric")).toBe("0.5 km");
    });
  });

  describe("imperial", () => {
    it("formats meters to miles correctly", () => {
      expect(formatDistance(1609.344, "imperial")).toBe("1 mi");
    });

    it("formats with decimals for partial miles", () => {
      expect(formatDistance(2414.016, "imperial")).toBe("1.5 mi");
    });

    it("formats large distances correctly", () => {
      expect(formatDistance(42195, "imperial")).toBe("26.22 mi");
    });

    it("handles zero correctly", () => {
      expect(formatDistance(0, "imperial")).toBe("0 mi");
    });

    it("formats small distances with decimals", () => {
      expect(formatDistance(804.672, "imperial")).toBe("0.5 mi");
    });
  });
});
