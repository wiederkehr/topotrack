import { describe, expect, it } from "vitest";

import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO date string correctly", () => {
    expect(formatDate("2024-01-15T10:30:00Z")).toBe("January 15, 2024");
  });

  it("handles different months correctly", () => {
    expect(formatDate("2024-12-25T12:00:00Z")).toBe("December 25, 2024");
  });

  it("handles single digit days correctly", () => {
    expect(formatDate("2024-03-05T12:00:00Z")).toBe("March 5, 2024");
  });
});
