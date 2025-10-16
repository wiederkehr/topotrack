import { describe, expect, it } from "vitest";

import { destructureOverrides } from "./destructureOverrides";

describe("destructureOverrides", () => {
  it("should destructure overrides with values", () => {
    const overrides = [
      { label: "Title", name: "name", value: "Custom Title" },
      { label: "Distance", name: "distance", value: "10km" },
    ];
    const result = destructureOverrides(overrides);
    expect(result).toEqual({
      name: "Custom Title",
      distance: "10km",
    });
  });

  it("should handle empty overrides array", () => {
    const result = destructureOverrides([]);
    expect(result).toEqual({});
  });

  it("should use empty string for undefined values", () => {
    const overrides = [{ label: "Title", name: "name" }];
    const result = destructureOverrides(overrides);
    expect(result).toEqual({ name: "" });
  });

  it("should handle multiple overrides with mixed values", () => {
    const overrides = [
      { label: "Title", name: "title", value: "My Title" },
      { label: "Subtitle", name: "subtitle", value: "" },
      { label: "Description", name: "description" },
    ];
    const result = destructureOverrides(overrides);
    expect(result).toEqual({
      title: "My Title",
      subtitle: "",
      description: "",
    });
  });
});
