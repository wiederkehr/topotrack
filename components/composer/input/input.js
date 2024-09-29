import styles from "./input.module.css";

import Search from "./search";
import Recents from "./recents";
import Format from "./format";
import Template from "./template";
import Preset from "./preset";
import Inputs from "./inputs";
import Export from "./export";
import { Tabs, Tab } from "@/components/interface/tabs";

export default function Input({
  activities,
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
            selectedActivity={activity}
            activities={activities}
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
