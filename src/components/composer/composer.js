import { useState, useRef } from "react";

import { formats, templates, assets } from "./settings";
import Search from "./input/search";
import Recents from "./input/recents";
import Format from "./input/format";
import Template from "./input/template";
import Variables from "./input/variables";
import Export from "./input/export";
import Canvas from "./output/canvas";
import Figure, { FigureDev } from "./output/figure";
import Scrollarea from "@/components/interface/scrollarea";
import { Tabs, Tab } from "@/components/interface/tabs";
import { toPng, toSvg, toMp4, formatFilename } from "@/functions/export";

import styles from "@/components/composer/composer.module.css";

// Mock Data
import { mockActivities, mockActivity, mockActivityData } from "./data";

export default function Composer() {
  // Activities
  // //////////////////////////////
  const [activities, setActivities] = useState(mockActivities);
  const [activityData, setActivityData] = useState(mockActivityData);

  // Activity Selection
  // //////////////////////////////
  const [activity, setActivity] = useState(mockActivity);
  const handleActivityChange = (id) => {
    const activity = activities.find((activity) => activity.id === id);
    setActivity(activity);
  };

  // Search
  // //////////////////////////////
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  // Format
  // //////////////////////////////
  const [format, setFormat] = useState(formats[0]);
  const handleFormatChange = (value) => {
    const format = formats.find((format) => format.name === value);
    setFormat(format);
  };

  // Template
  // //////////////////////////////
  const [template, setTemplate] = useState(templates[0]);
  const handleTemplateChange = (value) => {
    const template = templates.find((template) => template.name === value);
    setTemplate(template);
    setVariables(setVariablesDefaults(template.variables));
  };

  // Variables
  // //////////////////////////////
  const setVariablesDefaults = (variables) =>
    variables.map((variable) => ({
      name: variable.name,
      options: variable.options,
      value: variable.options[0],
    }));
  const [variables, setVariables] = useState(
    setVariablesDefaults(templates[0].variables)
  );
  const handleVariableChange = ({ name, value }) => {
    const index = variables.findIndex((variable) => variable.name === name);
    if (index !== -1) {
      const changedVariables = [...variables];
      changedVariables[index].value = value;
      setVariables(changedVariables);
    }
  };

  // Export
  // //////////////////////////////
  const figureRef = useRef(null);
  const [asset, setAsset] = useState(assets[0]);
  const handleAssetChange = (value) => {
    const asset = assets.find((asset) => asset.name === value);
    setAsset(asset);
  };
  const handleAssetExport = () => {
    const filename = formatFilename({
      date: activity.start_date_local,
      name: activity.name,
      format: format.name,
      type: asset.type,
    });
    switch (asset.type) {
      case "png":
        toPng({ node: figureRef.current, name: filename });
        break;
      case "svg":
        toSvg({ node: figureRef.current, name: filename });
        break;
      case "mp4":
        toMp4({ blob: null, name: filename });
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.composer}>
      <div className={styles.composerOutput}>
        <Scrollarea>
          <Canvas format={format}>
            <Figure
              ref={figureRef}
              activity={activity}
              activityData={activityData}
              template={template}
            />
            {/* <FigureDev
            activity={activity}
            template={template.name}
            variables={variables.map(({ name, value }) => ({ name, value }))}
          /> */}
          </Canvas>
        </Scrollarea>
      </div>
      <div className={styles.composerInput}>
        <Tabs names={["Activity", "Design", "Export"]}>
          <Tab name="Activity">
            <Search
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            <Recents
              selectedActivity={activity}
              activities={activities}
              onActivityChange={handleActivityChange}
            />
          </Tab>
          <Tab name="Design">
            <Format
              format={format}
              formats={formats}
              onFormatChange={handleFormatChange}
            />
            <Template
              template={template}
              templates={templates}
              onTemplateChange={handleTemplateChange}
            />
            <Variables
              variables={variables}
              onVariableChange={handleVariableChange}
            />
          </Tab>
          <Tab name="Export">
            <Export
              asset={asset}
              assets={assets}
              onAssetChange={handleAssetChange}
              onAssetExport={handleAssetExport}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
