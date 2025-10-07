import { describe, expect, it } from "vitest";

import { formatYear } from "./formatYear";

describe("formatYear", () => {
  it("extracts year from date string", () => {
    expect(formatYear("2024-01-15T10:30:00Z")).toBe("2024");
  });

  it("handles different years correctly", () => {
    expect(formatYear("2023-12-25T00:00:00Z")).toBe("2023");
  });

  it("handles year boundaries correctly", () => {
    expect(formatYear("2024-12-31T23:59:59Z")).toBe("2024");
  });
});
