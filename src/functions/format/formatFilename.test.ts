import { describe, expect, it } from "vitest";

import { formatFilename } from "./formatFilename";

describe("formatFilename", () => {
  it("formats filename with all components", () => {
    const result = formatFilename({
      date: "2024-01-15T10:30:00Z",
      name: "Morning Run",
      format: "Instagram Square",
      type: "png",
    });

    expect(result).toContain("topotrack");
    expect(result).toContain("morning-run");
    expect(result).toContain("instagram-square");
    expect(result).toContain(".png");
  });

  it("handles special characters in name", () => {
    const result = formatFilename({
      date: "2024-01-15T10:30:00Z",
      name: "Trail Run @ Mt. Hood!",
      format: "Square",
      type: "png",
    });

    expect(result).toContain("trail-run-mt-hood");
  });

  it("formats date component correctly", () => {
    const result = formatFilename({
      date: "2024-01-15T10:30:00Z",
      name: "Run",
      format: "Square",
      type: "png",
    });

    expect(result).toMatch(/topotrack-\d{6}-/);
  });
});
