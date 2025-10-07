import { describe, expect, it } from "vitest";

import { formatInitials } from "./formatInitials";

describe("formatInitials", () => {
  it("extracts initials from full name", () => {
    expect(formatInitials("John Doe")).toBe("JD");
  });

  it("handles single name", () => {
    expect(formatInitials("John")).toBe("J");
  });

  it("handles three-part names", () => {
    expect(formatInitials("John Michael Doe")).toBe("JMD");
  });

  it("handles empty parts", () => {
    expect(formatInitials("John  Doe")).toBe("JD");
  });
});
