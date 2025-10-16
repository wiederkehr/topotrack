import { create } from "zustand";

import { defaultPreset } from "@/features/composer/composer.settings";
import { templates } from "@/features/templates";
import type {
  OverrideType,
  PresetType,
  TemplateType,
  VariableType,
} from "@/types";

interface TemplateState {
  initializeTemplate: () => void;
  overrides: OverrideType[];
  preset: PresetType;
  presets: PresetType[];
  setOverride: (override: { name: string; value: string }) => void;
  setPreset: (value: string) => void;

  // Actions
  setTemplate: (value: string) => void;
  setVariable: (variable: { name: string; value: string }) => void;
  // State
  template: TemplateType;
  variables: VariableType[];
}

const getVariables = (
  template: TemplateType,
  preset: PresetType,
): VariableType[] => {
  return template.variables.map((variable) => ({
    ...variable,
    value: preset[variable.name] || "",
  }));
};

const getOverrides = (template: TemplateType): OverrideType[] => {
  return template.overrides.map((override) => ({
    ...override,
    value: "",
  }));
};

export const useTemplateStore = create<TemplateState>((set, get) => ({
  // Initial state
  template: templates[0]!,
  presets: templates[0]!.presets,
  preset: templates[0]!.presets[0] || defaultPreset,
  variables: getVariables(
    templates[0]!,
    templates[0]!.presets[0] || defaultPreset,
  ),
  overrides: getOverrides(templates[0]!),

  // Actions
  setTemplate: (value) => {
    const template = templates.find((template) => template.name === value);
    if (template) {
      const presets = template.presets;
      const preset = template.presets[0] || defaultPreset;
      const variables = getVariables(template, preset);
      const overrides = getOverrides(template);

      set({
        template,
        presets,
        preset,
        variables,
        overrides,
      });
    }
  },

  setPreset: (value) => {
    const { presets, template } = get();
    const preset = presets.find((preset) => preset.name === value);
    if (preset) {
      const variables = getVariables(template, preset);
      // Don't reset overrides when changing presets - preserve user input
      set({ preset, variables });
    }
  },

  setVariable: (newVariable) => {
    const { variables, presets } = get();
    const newVariables = variables.map((oldVariable) =>
      oldVariable.name === newVariable.name
        ? { ...oldVariable, value: newVariable.value }
        : oldVariable,
    );

    // Check if the new variables match any existing preset
    const matchingPreset = presets.find((preset) => {
      return Object.keys(preset).every((key) => {
        return (
          newVariables.find((variable) => variable.name === key)?.value ===
          preset[key]
        );
      });
    });

    set({
      preset: matchingPreset || defaultPreset,
      variables: newVariables,
    });
  },

  setOverride: (newOverride) => {
    const { overrides } = get();
    const newOverrides = overrides.map((oldOverride) =>
      oldOverride.name === newOverride.name
        ? { ...oldOverride, value: newOverride.value }
        : oldOverride,
    );

    set({ overrides: newOverrides });
  },

  initializeTemplate: () => {
    const template = templates[0]!;
    const presets = template.presets;
    const preset = presets[0] || defaultPreset;
    const variables = getVariables(template, preset);
    const overrides = getOverrides(template);

    set({
      template,
      presets,
      preset,
      variables,
      overrides,
    });
  },
}));
