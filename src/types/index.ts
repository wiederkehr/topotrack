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

export type FormatType = {
  height: number;
  name: string;
  width: number;
};

export type PresetType = {
  [key: string]: string;
  name: string;
};

export type RenderType = {
  activity: ActivityType;
  activityData: ActivityStreamsType;
  format: FormatType;
  size: SizeType;
  units: "metric" | "imperial";
  variables: VariableType[];
};

export type SizeType = {
  height: number;
  width: number;
};

export type TemplateType = {
  Render: React.ElementType;
  name: string;
  presets: PresetType[];
  variables: VariableType[];
};

export type VariableType = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  type: "select" | "color" | "text";
  value?: string;
};
