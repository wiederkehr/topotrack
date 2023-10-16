import { useState } from "react";

import { Tabs, Tab } from "./interface/tabs";
import Canvas from "./output/canvas";
import Search from "./input/search";
import Recents from "./input/recents";
import Formats from "./input/formats";
import Themes from "./input/themes";
import Variables from "./input/variables";
import Export from "./input/export";

import { FigureDev } from "@/components/composer/output/figure";

import { formats, themes, assets } from "./settings";

import styles from "@/components/composer/composer.module.css";

export default function Composer() {
  // Activity Selection Logic
  // //////////////////////////////
  const activities = [
    { id: 1, date: "10.10.2023", name: "Wild Basin Loop" },
    { id: 2, date: "11.10.2023", name: "Bear Lake Loop" },
    { id: 3, date: "12.10.2023", name: "Hagues, Mummy Loop" },
    { id: 4, date: "13.10.2023", name: "Longs Peak" },
  ];
  const [activity, setActivity] = useState(activities[0]);
  const handleActivityChange = (id) => {
    const activity = activities.find((activity) => activity.id === id);
    setActivity(activity);
  };

  // Search Logic
  // //////////////////////////////
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  // Format Logic
  // //////////////////////////////
  const [format, setFormat] = useState(formats[0]);
  const handleFormatChange = (value) => {
    const format = formats.find((format) => format.name === value);
    setFormat(format);
  };

  // Theme Logic
  // //////////////////////////////
  const [theme, setTheme] = useState(themes[0]);
  const handleThemeChange = (value) => {
    const theme = themes.find((theme) => theme.name === value);
    setTheme(theme);
    setVariables(setVariableValues(theme.variables));
  };

  // Variable Logic
  // //////////////////////////////
  const setVariableValues = (variables) =>
    variables.map((variable) => ({
      name: variable.name,
      options: variable.options,
      value: variable.options[0],
    }));
  const [variables, setVariables] = useState(
    setVariableValues(themes[0].variables)
  );
  const handleVariableChange = ({ name, value }) => {
    const index = variables.findIndex((variable) => variable.name === name);
    if (index !== -1) {
      const changedVariables = [...variables];
      changedVariables[index].value = value;
      setVariables(changedVariables);
    }
  };

  // Export Logic
  // //////////////////////////////
  const [asset, setAsset] = useState(assets[0]);
  const handleAssetChange = (value) => {
    const asset = assets.find((asset) => asset.name === value);
    setAsset(asset);
  };
  const handleAssetExport = (event) => {
    console.log(event);
  };

  return (
    <div className={styles.composer}>
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
            <Formats
              format={format}
              formats={formats}
              onFormatChange={handleFormatChange}
            />
            <Themes
              theme={theme}
              themes={themes}
              onThemeChange={handleThemeChange}
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
      <div className={styles.composerOutput}>
        <Canvas format={format}>
          <FigureDev
            activity={activity}
            theme={theme.name}
            variables={variables.map(({ name, value }) => ({ name, value }))}
          />
        </Canvas>
      </div>
    </div>
  );
}
