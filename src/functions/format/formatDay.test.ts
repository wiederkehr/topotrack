import { describe, expect, it } from "vitest";

import { formatMonthDay } from "./formatDay";

describe("formatMonthDay", () => {
  it("formats date to month and day", () => {
    expect(formatMonthDay("2024-01-15T10:30:00Z")).toBe("January 15");
  });

  it("handles different months correctly", () => {
    expect(formatMonthDay("2024-12-25T12:00:00Z")).toBe("December 25");
  });

  it("handles single digit days correctly", () => {
    expect(formatMonthDay("2024-03-05T12:00:00Z")).toBe("March 5");
  });
});
