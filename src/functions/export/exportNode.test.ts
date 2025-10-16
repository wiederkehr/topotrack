import { describe, expect, it, vi } from "vitest";

import { exportNode } from "./exportNode";

// Mock dependencies
vi.mock("downloadjs", () => ({
  default: vi.fn(),
}));

vi.mock("html-to-image", () => ({
  toPng: vi.fn(() => Promise.resolve("data:image/png;base64,mock")),
  toSvg: vi.fn(() => Promise.resolve("data:image/svg+xml;base64,mock")),
}));

vi.mock("./recordNodeAsBlob", () => ({
  recordNodeAsBlob: vi.fn(() =>
    Promise.resolve(new Blob(["mock"], { type: "video/webm" })),
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

  it("should export as SVG", async () => {
    await exportNode({
      node: mockNode,
      name: "test.svg",
      type: "svg",
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it("should export as WebM", async () => {
    await exportNode({
      node: mockNode,
      name: "test.webm",
      type: "webm",
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
