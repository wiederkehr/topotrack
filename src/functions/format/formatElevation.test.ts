import { describe, expect, it } from "vitest";

import { formatElevation } from "./formatElevation";

describe("formatElevation", () => {
  describe("metric", () => {
    it("formats meters correctly", () => {
      expect(formatElevation(1000, "metric")).toBe("1,000 m");
    });

    it("rounds to whole numbers", () => {
      expect(formatElevation(1234.56, "metric")).toBe("1,235 m");
    });

    it("handles zero correctly", () => {
      expect(formatElevation(0, "metric")).toBe("0 m");
    });

    it("handles small values correctly", () => {
      expect(formatElevation(5, "metric")).toBe("5 m");
    });

    it("handles large values correctly", () => {
      expect(formatElevation(8848, "metric")).toBe("8,848 m");
    });
  });

  describe("imperial", () => {
    it("formats meters to feet correctly", () => {
      expect(formatElevation(1000, "imperial")).toBe("3,281 ft");
    });

    it("rounds to whole numbers", () => {
      expect(formatElevation(100, "imperial")).toBe("328 ft");
    });

    it("handles zero correctly", () => {
      expect(formatElevation(0, "imperial")).toBe("0 ft");
    });

    it("handles small values correctly", () => {
      expect(formatElevation(1, "imperial")).toBe("3 ft");
    });

    it("handles large values correctly", () => {
      expect(formatElevation(8848, "imperial")).toBe("29,029 ft");
    });
  });
});
