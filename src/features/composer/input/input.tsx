import Activities from "./activities";
import Export from "./export";
import Format from "./format";
import styles from "./input.module.css";
import Inputs from "./inputs";
import Preset from "./preset";
import Search from "./search";
import { Tab, Tabs } from "./tabs";
import Template from "./template";

type ActivityType = {
  id: string;
  name: string;
  start_date_local: string;
};

type AssetType = {
  name: string;
};

type FormatType = {
  height: number;
  name: string;
  width: number;
};

type TemplateType = {
  name: string;
};

type PresetType = {
  name: string;
};

type InputType = {
  name: string;
  options?: string[];
  type: "select" | "color";
};

type VariableType = {
  [key: string]: string;
};

type InputProps = {
  activities: ActivityType[];
  activitiesError: boolean;
  activitiesLoading: boolean;
  activity: ActivityType | null;
  asset: AssetType;
  assets: AssetType[];
  disableLoadMore: boolean;
  format: FormatType;
  formats: FormatType[];
  inputs: InputType[];
  onActivityChange: (id: string) => void;
  onAssetChange: (value: string) => void;
  onAssetExport: () => void;
  onFormatChange: (value: string) => void;
  onLoadMore: () => void;
  onPresetChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onTemplateChange: (value: string) => void;
  onVariableChange: (variable: { name: string; value: string }) => void;
  preset: PresetType;
  presets: PresetType[];
  searchTerm: string;
  template: TemplateType;
  templates: TemplateType[];
  variables: VariableType;
};

function Input({
  activities,
  activitiesError,
  activitiesLoading,
  activity,
  asset,
  assets,
  format,
  formats,
  onActivityChange,
  onAssetChange,
  onAssetExport,
  onFormatChange,
  onSearchChange,
  onTemplateChange,
  onPresetChange,
  onVariableChange,
  onLoadMore,
  disableLoadMore,
  searchTerm,
  template,
  templates,
  preset,
  presets,
  inputs,
  variables,
}: InputProps) {
  return (
    <div className={styles.input}>
      <Tabs names={["Activity", "Design", "Export"]}>
        <Tab name="Activity">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
          <Activities
            activities={activities}
            activitiesError={activitiesError}
            activitiesLoading={activitiesLoading}
            selectedActivity={activity}
            onActivityChange={onActivityChange}
            onLoadMore={onLoadMore}
            disableLoadMore={disableLoadMore}
          />
        </Tab>
        <Tab name="Design">
          <Format
            format={format}
            formats={formats}
            onFormatChange={onFormatChange}
          />
          <Template
            template={template}
            templates={templates}
            onTemplateChange={onTemplateChange}
          />
          <Preset
            preset={preset}
            presets={presets}
            onPresetChange={onPresetChange}
          />
          <Inputs
            inputs={inputs}
            variables={variables}
            onVariableChange={onVariableChange}
          />
        </Tab>
        <Tab name="Export">
          <Export
            asset={asset}
            assets={assets}
            onAssetChange={onAssetChange}
            onAssetExport={onAssetExport}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Input;
export type {
  ActivityType,
  AssetType,
  FormatType,
  InputProps,
  InputType,
  PresetType,
  TemplateType,
  VariableType,
};
