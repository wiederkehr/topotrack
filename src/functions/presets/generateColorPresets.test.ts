import { describe, expect, it } from "vitest";

import { colors } from "@/styles/constants";

import { generateColorPresets } from "./generateColorPresets";

describe("generateColorPresets", () => {
  it("generates presets with dark background, light accent, and dark contrast", () => {
    const presets = generateColorPresets({
      background: "dark",
      accent: "light",
      contrast: "contrast",
    });

    // Should have a preset for each color in colors.light
    const colorNames = Object.keys(colors.light);
    expect(presets).toHaveLength(colorNames.length);

    // Check first preset (yellow)
    expect(presets[0]).toEqual({
      name: "Yellow",
      background: colors.dark.yellow,
      accent: colors.light.yellow,
      contrast: colors.contrast.dark,
    });

    // Check a middle preset (blue)
    const bluePreset = presets.find((p) => p.name === "Blue");
    expect(bluePreset).toEqual({
      name: "Blue",
      background: colors.dark.blue,
      accent: colors.light.blue,
      contrast: colors.contrast.dark,
    });

    // Check last preset (gray)
    const grayPreset = presets.find((p) => p.name === "Gray");
    expect(grayPreset).toEqual({
      name: "Gray",
      background: colors.dark.gray,
      accent: colors.light.gray,
      contrast: colors.contrast.dark,
    });
  });

  it("generates presets with mono foreground, light middleground, and dark background", () => {
    const presets = generateColorPresets({
      foreground: "mono",
      middleground: "light",
      background: "dark",
    });

    // Should have a preset for each color
    const colorNames = Object.keys(colors.light);
    expect(presets).toHaveLength(colorNames.length);

    // Check first preset
    expect(presets[0]).toEqual({
      name: "Yellow",
      foreground: colors.mono.white,
      middleground: colors.light.yellow,
      background: colors.dark.yellow,
    });

    // Check a specific preset
    const indigoPreset = presets.find((p) => p.name === "Indigo");
    expect(indigoPreset).toEqual({
      name: "Indigo",
      foreground: colors.mono.white,
      middleground: colors.light.indigo,
      background: colors.dark.indigo,
    });
  });

  it("capitalizes color names correctly", () => {
    const presets = generateColorPresets({
      color: "light",
    });

    // Check various capitalization
    expect(presets.find((p) => p.name === "Yellow")).toBeDefined();
    expect(presets.find((p) => p.name === "Blue")).toBeDefined();
    expect(presets.find((p) => p.name === "Crimson")).toBeDefined();
    expect(presets.find((p) => p.name === "Sky")).toBeDefined();

    // Should not have lowercase names
    expect(presets.find((p) => p.name === "yellow")).toBeUndefined();
    expect(presets.find((p) => p.name === "blue")).toBeUndefined();
  });

  it("handles different variable name mappings", () => {
    const presets = generateColorPresets({
      primary: "light",
      secondary: "dark",
      tertiary: "mono",
    });

    expect(presets[0]).toHaveProperty("name");
    expect(presets[0]).toHaveProperty("primary");
    expect(presets[0]).toHaveProperty("secondary");
    expect(presets[0]).toHaveProperty("tertiary");
  });

  it("includes all Radix color variants", () => {
    const presets = generateColorPresets({
      color: "light",
    });

    const presetNames = presets.map((p) => p.name?.toLowerCase());

    // Check that all major color families are present
    const expectedColors = [
      "yellow",
      "amber",
      "orange",
      "tomato",
      "red",
      "ruby",
      "crimson",
      "pink",
      "plum",
      "purple",
      "violet",
      "iris",
      "indigo",
      "blue",
      "cyan",
      "sky",
      "mint",
      "teal",
      "jade",
      "green",
      "grass",
      "lime",
      "gray",
    ];

    for (const color of expectedColors) {
      expect(presetNames).toContain(color);
    }
  });
});
