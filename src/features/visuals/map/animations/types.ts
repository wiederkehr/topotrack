import type { LngLatBoundsLike, Map as MapboxGLMap } from "mapbox-gl";

// Fit Bounds Type
export type FitBoundsOptions = {
  bounds: LngLatBoundsLike;
  duration?: number;
  padding?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
};

// Bearing Options Type - discriminated union for type-safe bearing modes
export type BearingOptions =
  | {
      bearing: number;
      type: "fixed";
    }
  | {
      bearing: number;
      damping: number;
      lookAhead: number;
      type: "dynamic";
    }
  | {
      bearing: number;
      damping?: number;
      type: "rotation";
    };

// Follow Path Type
export type FollowPathOptions = {
  bearingOptions?: BearingOptions;
  duration: number;
  padding?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  pitch?: number;
  route: [number, number][];
};

// Animate Point Type
export type AnimatePointOptions = {
  duration: number;
  pointSourceId: string;
  route: [number, number][];
};

// Animate Path Type (animate route visualization)
export type AnimatePathOptions = {
  duration: number;
  lineSourceId: string;
  route: [number, number][];
};

// Animate Route Type (synchronized line and point animation)
export type AnimateRouteOptions = {
  duration: number;
  lineSourceId: string;
  pointSourceId: string;
  route: [number, number][];
};

// Rotate Around Point Type
export type RotateAroundPointOptions = {
  bearing?: number;
  degrees: number;
  duration: number;
};

// Animation Phases Union Type
export type AnimationPhase =
  | {
      options: Parameters<MapboxGLMap["easeTo"]>[0];
      type: "easeTo";
    }
  | {
      options: Parameters<MapboxGLMap["flyTo"]>[0];
      type: "flyTo";
    }
  | {
      options: FitBoundsOptions;
      type: "fitBounds";
    }
  | {
      options: AnimatePointOptions;
      type: "animatePoint";
    }
  | {
      options: AnimatePathOptions;
      type: "animatePath";
    }
  | {
      options: AnimateRouteOptions;
      type: "animateRoute";
    }
  | {
      duration: number;
      type: "wait";
    }
  | {
      fn: (map: MapboxGLMap) => Promise<void>;
      type: "custom";
    }
  | {
      options: FollowPathOptions;
      type: "followPath";
    }
  | {
      options: RotateAroundPointOptions;
      type: "rotateAroundPoint";
    }
  | {
      phases: AnimationPhase[];
      type: "sync";
    };

// Animation Sequence Type
export type AnimationSequence = {
  phases: AnimationPhase[];
  totalDuration?: number;
};
