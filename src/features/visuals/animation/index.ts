/**
 * Placeholder for old animation system
 * This module is kept for backward compatibility with mapGLAnimated
 * New animation system is in src/features/visuals/map/animations/
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Map as MapboxGLMap } from "mapbox-gl";
import type { ReactNode } from "react";

export type AnimationConfig = Record<string, unknown> | null;

export type PreCalculatedAnimation = {
  [key: string]: unknown;
  config: AnimationConfig;
};

export const DEFAULT_ANIMATION_SETTINGS = {};

export function preCalculateAnimation(
  _routeData: Array<[number, number]>,
  _settings: Record<string, unknown>,
): PreCalculatedAnimation {
  return {
    config: {},
  };
}

interface AnimationControllerPreviewProps {
  config: AnimationConfig;
  map: MapboxGLMap | null;
}

export function AnimationControllerPreview(
  _props: AnimationControllerPreviewProps,
): ReactNode {
  return null;
}

interface ExportAnimationControllerProps {
  map: MapboxGLMap | null;
  preCalculated: PreCalculatedAnimation;
}

export function ExportAnimationController(
  _props: ExportAnimationControllerProps,
): ReactNode {
  return null;
}
