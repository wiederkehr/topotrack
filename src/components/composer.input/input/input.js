import styles from "./input.module.css";

import Search from "@/components/composer.input/search";
import Recents from "@/components/composer.input/recents";
import Format from "@/components/composer.input/format";
import Template from "@/components/composer.input/template";
import Variables from "@/components/composer.input/variables";
import Export from "@/components/composer.input/export";
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
  onVariableChange,
  searchTerm,
  template,
  templates,
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
          <Variables
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
