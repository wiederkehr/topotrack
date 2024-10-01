import styles from "./input.module.css";

import { Tab, Tabs } from "@/components/interface/tabs";
import Export from "./export";
import Format from "./format";
import Inputs from "./inputs";
import Preset from "./preset";
import Recents from "./recents";
import Search from "./search";
import Template from "./template";

export default function Input({
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
  searchTerm,
  template,
  templates,
  preset,
  presets,
  inputs,
  variables,
}) {
  return (
    <div className={styles.input}>
      <Tabs names={["Activity", "Design", "Export"]}>
        <Tab name="Activity">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
          <Recents
            activities={activities}
            activitiesError={activitiesError}
            activitiesLoading={activitiesLoading}
            selectedActivity={activity}
            onActivityChange={onActivityChange}
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
