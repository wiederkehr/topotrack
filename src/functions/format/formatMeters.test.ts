import { describe, expect, it } from "vitest";

import { formatMeters } from "./formatMeters";

describe("formatMeters", () => {
  it("formats whole meters correctly", () => {
    expect(formatMeters(1000)).toBe("1,000 m");
  });

  it("rounds decimal values to whole numbers", () => {
    expect(formatMeters(1234.56)).toBe("1,235 m");
  });

  it("handles zero correctly", () => {
    expect(formatMeters(0)).toBe("0 m");
  });

  it("handles single digit correctly", () => {
    expect(formatMeters(5)).toBe("5 m");
  });

  it("handles large numbers correctly", () => {
    expect(formatMeters(1000000)).toBe("1,000,000 m");
  });
});
