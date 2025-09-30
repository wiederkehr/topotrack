import { create } from "zustand";
import type { PresetType, TemplateType, VariableType } from "@/types";
import templates from "@/features/templates";
import { defaultPreset } from "@/features/composer/composer.settings";

interface TemplateState {
  // State
  template: TemplateType;
  presets: PresetType[];
  preset: PresetType;
  variables: VariableType[];

  // Actions
  setTemplate: (value: string) => void;
  setPreset: (value: string) => void;
  setVariable: (variable: { name: string; value: string }) => void;
  initializeTemplate: () => void;
}

const getVariables = (template: TemplateType, preset: PresetType): VariableType[] => {
  return template.variables.map((variable) => ({
    ...variable,
    value: preset[variable.name] || "",
  }));
};

export const useTemplateStore = create<TemplateState>((set, get) => ({
  // Initial state
  template: templates[0]!,
  presets: templates[0]!.presets,
  preset: templates[0]!.presets[0] || defaultPreset,
  variables: getVariables(templates[0]!, templates[0]!.presets[0] || defaultPreset),

  // Actions
  setTemplate: (value) => {
    const template = templates.find((template) => template.name === value);
    if (template) {
      const presets = template.presets;
      const preset = template.presets[0] || defaultPreset;
      const variables = getVariables(template, preset);

      set({
        template,
        presets,
        preset,
        variables,
      });
    }
  },

  setPreset: (value) => {
    const { presets, template } = get();
    const preset = presets.find((preset) => preset.name === value);
    if (preset) {
      const variables = getVariables(template, preset);
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

  initializeTemplate: () => {
    const template = templates[0]!;
    const presets = template.presets;
    const preset = presets[0] || defaultPreset;
    const variables = getVariables(template, preset);

    set({
      template,
      presets,
      preset,
      variables,
    });
  },
}));