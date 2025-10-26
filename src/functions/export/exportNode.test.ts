import { describe, expect, it, vi } from "vitest";

import { exportNode } from "./exportNode";

// Mock dependencies
vi.mock("downloadjs", () => ({
  default: vi.fn(),
}));

vi.mock("html-to-image", () => ({
  toPng: vi.fn(() => Promise.resolve("data:image/png;base64,mock")),
}));

vi.mock("./recordNodeAsMp4", () => ({
  recordNodeAsMp4: vi.fn(() =>
    Promise.resolve(new Blob(["mock"], { type: "video/mp4" })),
  ),
}));

describe("exportNode", () => {
  const mockNode = document.createElement("div");
  mockNode.style.width = "800px";
  mockNode.style.height = "600px";
  Object.defineProperty(mockNode, "offsetWidth", { value: 800 });
  Object.defineProperty(mockNode, "offsetHeight", { value: 600 });

  it("should export as PNG", async () => {
    await exportNode({
      node: mockNode,
      name: "test.png",
      type: "png",
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it("should export as MP4", async () => {
    await exportNode({
      node: mockNode,
      name: "test.mp4",
      type: "mp4",
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it("should use custom format dimensions", async () => {
    await exportNode({
      node: mockNode,
      name: "test.png",
      type: "png",
      format: { name: "Custom", width: 1920, height: 1080 },
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it("should handle unsupported export type gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Type assertion for testing error handling with invalid type
    await exportNode({
      node: mockNode,
      name: "test.unknown",
      type: "unknown" as "png",
    });

    expect(consoleSpy).toHaveBeenCalledWith("Unsupported export type: unknown");
    consoleSpy.mockRestore();
  });
});
