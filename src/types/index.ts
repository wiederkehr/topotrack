export type ActivityDataType = {
  data: [];
  type: string;
};

export type ActivityType = {
  id: number;
  name: string;
  start_date_local: string;
  start_latlng?: [number, number];
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
  activityData: ActivityDataType[];
  format: FormatType;
  size: SizeType;
  variables: { [key: string]: string };
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
  type: "select" | "color";
  value?: string;
};
