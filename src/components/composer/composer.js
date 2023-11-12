import { useState, useRef } from "react";
import { useStrava } from "@/hooks/useStrava";

import Input from "@/components/composer.input/input";
import Output from "@/components/composer.output/output";
import templates from "@/components/composer.output/templates";
import { formats, assets } from "./composer.settings";
import { toPng, toSvg, toMp4, formatFilename } from "@/functions/export";
import { mockActivities, mockActivity, mockActivityData } from "@/data/mock";
import styles from "./composer.module.css";

export default function Composer() {
  // Activities
  // //////////////////////////////
  const [activities, setActivities] = useState(mockActivities);

  // Activity
  // //////////////////////////////
  const [activity, setActivity] = useState(mockActivity);
  const handleActivityChange = (id) => {
    const activity = activities.find((activity) => activity.id === id);
    setActivity(activity);
  };

  // Activity Data
  // //////////////////////////////
  const { activityData, activityError } = {
    activityData: mockActivityData,
    error: null,
  };
  // const { data, error } = useStrava(
  //   `activities/${activity.id}/streams?keys=[time,distance,latlng,altitude]`
  // );

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
      <Output
        activity={activity}
        activityData={activityData}
        figureRef={figureRef}
        format={format}
        template={template}
        variables={variables}
      />
      <Input
        activities={activities}
        activity={activity}
        asset={asset}
        assets={assets}
        format={format}
        formats={formats}
        onActivityChange={handleActivityChange}
        onAssetChange={handleAssetChange}
        onAssetExport={handleAssetExport}
        onFormatChange={handleFormatChange}
        onSearchChange={handleSearchChange}
        onTemplateChange={handleTemplateChange}
        onVariableChange={handleVariableChange}
        searchTerm={searchTerm}
        template={template}
        templates={templates}
        variables={variables}
      />
    </div>
  );
}
