export type VariableBaseType = {
  label: string;
  name: string;
  type: string;
};

export type VariableSelectType = VariableBaseType & {
  options: string[];
};

export type VariableType = VariableBaseType | VariableSelectType;

export type RenderBaseProps = {
  activity: any;
  activityData: any;
  format: string;
  size: {
    height: number;
    width: number;
  };
};
