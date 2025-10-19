export type ActivityStreamType = {
  data: number[] | [number, number][] | boolean[];
  original_size: number;
  resolution: string;
  series_type: string;
  type?: string;
};

export type ActivityStreamsType = {
  altitude?: ActivityStreamType;
  cadence?: ActivityStreamType;
  distance?: ActivityStreamType;
  grade_smooth?: ActivityStreamType;
  heartrate?: ActivityStreamType;
  latlng?: ActivityStreamType;
  moving?: ActivityStreamType;
  temp?: ActivityStreamType;
  time?: ActivityStreamType;
  velocity_smooth?: ActivityStreamType;
  watts?: ActivityStreamType;
};

export type ActivityType = {
  address?: {
    country?: string;
    state?: string;
  };
  id: number;
  name: string;
  start_date_local: string;
  start_latlng?: [number, number] | null;
};

export type AssetType = {
  name: string;
  type: string;
};

export type FormatNameType =
  | "Square"
  | "Portrait"
  | "Story"
  | "Landscape"
  | "Custom";

export type FormatType = {
  height: number;
  name: FormatNameType;
  width: number;
};

export type PresetType = {
  [key: string]: string;
  name: string;
};

export type OverrideType = {
  label: string;
  name: string;
  value?: string;
};

export type UnitType = "metric" | "imperial";

export type VisualType = {
  activity: ActivityType;
  activityData: ActivityStreamsType;
  format: FormatType;
  overrides: OverrideType[];
  size: SizeType;
  units: UnitType;
  variables: VariableType[];
};

export type SizeType = {
  height: number;
  width: number;
};

export type TemplateType = {
  Visual: React.ElementType;
  name: string;
  overrides: OverrideType[];
  presets: PresetType[];
  variables: VariableType[];
};

export type VariableType = {
  label: string;
  name: string;
  options?: string[];
  type: "select" | "color";
  value?: string;
};

export type PaddingType = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};
