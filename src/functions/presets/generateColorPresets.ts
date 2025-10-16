import { colors } from "@/styles/constants";
import { PresetType } from "@/types";

/**
 * Maps variable names to their color source
 * e.g., { background: "dark", accent: "light", contrast: "contrast" }
 */
type ColorMapping = Record<string, "light" | "dark" | "mono" | "contrast">;

/**
 * Generates color presets for a template based on variable name mappings
 *
 * @param variableMapping - Maps variable names to color sources (light/dark/mono/contrast)
 * @returns Array of preset objects with name and color values for each variable
 *
 * @example
 * // For templateStatic1 with variables: background, accent, contrast
 * const presets = generateColorPresets({
 *   background: "dark",
 *   accent: "light",
 *   contrast: "contrast"
 * });
 * // Returns: [{ name: "Gray", background: "#...", accent: "#...", contrast: "#..." }, ...]
 *
 * @example
 * // For templateStatic2 with variables: foreground, middleground, background
 * const presets = generateColorPresets({
 *   foreground: "mono",
 *   middleground: "light",
 *   background: "dark"
 * });
 */
export function generateColorPresets(
  variableMapping: ColorMapping,
): PresetType[] {
  const presets: PresetType[] = [];

  // Get all color names from the light object (same keys exist in dark)
  const colorNames = Object.keys(colors.light) as Array<
    keyof typeof colors.light
  >;

  // Generate a preset for each color
  for (const colorName of colorNames) {
    const preset: Record<string, string> = {
      name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
    };

    // For each variable, get the color value from the appropriate source
    for (const [variableName, source] of Object.entries(variableMapping)) {
      if (source === "light") {
        preset[variableName] = colors.light[colorName];
      } else if (source === "dark") {
        preset[variableName] = colors.dark[colorName];
      } else if (source === "mono") {
        // For mono, use white as default
        preset[variableName] = colors.mono.white;
      } else if (source === "contrast") {
        // For contrast, use dark as default
        preset[variableName] = colors.contrast.dark;
      }
    }

    presets.push(preset as PresetType);
  }

  return presets;
}
