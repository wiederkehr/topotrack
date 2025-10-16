import { AxiosError } from "axios";

import templates from "@/features/templates";
import { useActivityStore, useExportStore, useTemplateStore } from "@/stores";

import { assets, formats } from "../composer.settings";
import Activities from "./activities";
import Controls from "./controls";
import Export from "./export";
import Format from "./format";
import styles from "./input.module.css";
import Overrides from "./overrides";
import Preset from "./preset";
import Search from "./search";
import { Tab, Tabs } from "./tabs";
import Template from "./template";

type InputProps = {
  activitiesError: AxiosError | null;
  activitiesLoading: boolean;
  onLoadMore: () => void;
};

function Input({ activitiesError, activitiesLoading, onLoadMore }: InputProps) {
  const {
    activity,
    visibleActivities,
    searchTerm,
    handleActivityChange,
    handleSearchChange,
  } = useActivityStore();
  const {
    template,
    presets,
    preset,
    variables,
    overrides,
    setTemplate,
    setPreset,
    setVariable,
    setOverride,
  } = useTemplateStore();
  const { format, asset, setFormat, setAsset, handleExport } = useExportStore();

  const disableLoadMore = activitiesLoading || searchTerm.length >= 3;

  const handleAssetExport = () => {
    if (activity) {
      handleExport({
        start_date_local: activity.start_date_local,
        name: activity.name,
      });
    }
  };
  return (
    <div className={styles.input}>
      <Tabs names={["Activity", "Design", "Export"]}>
        <Tab name="Activity">
          <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <Activities
            activities={visibleActivities}
            activitiesError={activitiesError}
            activitiesLoading={activitiesLoading}
            selectedActivity={activity}
            onActivityChange={handleActivityChange}
            onLoadMore={onLoadMore}
            disableLoadMore={disableLoadMore}
          />
        </Tab>
        <Tab name="Design">
          <Template
            template={template}
            templates={templates}
            onTemplateChange={setTemplate}
          />
          <Preset
            preset={preset}
            presets={presets}
            onPresetChange={setPreset}
          />
          <Controls variables={variables} onVariableChange={setVariable} />
          <Overrides
            overrides={overrides}
            onOverrideChange={setOverride}
            activity={activity}
          />
        </Tab>
        <Tab name="Export">
          <Format
            format={format}
            formats={formats}
            onFormatChange={setFormat}
          />
          <Export
            asset={asset}
            assets={assets}
            onAssetChange={setAsset}
            onAssetExport={handleAssetExport}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Input;
