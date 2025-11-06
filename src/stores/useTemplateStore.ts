import { create } from "zustand";

import { defaultPreset } from "@/features/composer/composer.settings";
import { templates } from "@/features/templates";
import { AnimationController } from "@/features/visuals/map/animations";
import type {
  OverrideType,
  PresetType,
  TemplateType,
  VariableType,
} from "@/types";

type AnimationState = "playing" | "paused" | "stopped";

interface TemplateState {
  animationController?: AnimationController;
  animationState: AnimationState;
  clearAnimationController: () => void;
  initializeTemplate: () => void;
  overrides: OverrideType[];
  playAnimation: () => void;
  preset: PresetType;
  presets: PresetType[];
  resetAnimation: () => void;
  setAnimationController: (controller: AnimationController) => void;
  setOverride: (override: { name: string; value: string }) => void;
  setPreset: (value: string) => void;
  setTemplate: (value: string) => void;
  setVariable: (variable: { name: string; value: string }) => void;
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
  animationState: "stopped",
  animationController: undefined,

  // Actions
  setTemplate: (value) => {
    const { animationController } = get();
    const template = templates.find((template) => template.name === value);
    if (template) {
      const presets = template.presets;
      const preset = template.presets[0] || defaultPreset;
      const variables = getVariables(template, preset);
      const overrides = getOverrides(template);

      // Reset animation when template changes
      animationController?.stop();

      set({
        template,
        presets,
        preset,
        variables,
        overrides,
        animationState: "stopped",
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

  // Animation control actions
  playAnimation: () => {
    const { animationController } = get();
    console.log(
      "[useTemplateStore] playAnimation called, isRunning:",
      animationController?.isRunning(),
    );
    // To play from the beginning, first stop any running animation
    if (animationController?.isRunning()) {
      animationController.stop();
    }
    // Reset state to start playing again
    set({ animationState: "playing" });
  },

  resetAnimation: () => {
    const { animationController } = get();
    console.log("[useTemplateStore] resetAnimation called");
    set({
      animationState: "stopped",
    });
    // Stop and reset animation via controller
    animationController?.stop();
  },

  setAnimationController: (controller: AnimationController) => {
    set({ animationController: controller });
  },

  clearAnimationController: () => {
    set({ animationController: undefined });
  },
}));
