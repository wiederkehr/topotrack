"use client";

import { useState, useRef } from "react";
import { useStrava } from "@/hooks/useStrava";

import Input from "./input";
import Output from "./output";
import templates from "./templates";
import { formats, assets } from "./composer.settings";
import { toPng, toSvg, toMp4, formatFilename } from "@/functions/export";
import { mockActivities, mockActivity, mockActivityData } from "@/data/mock";
import styles from "./composer.module.css";

export default function Composer() {
  // Activities
  // //////////////////////////////
  // NOTE: This is a mock of the Strava API response.
  const [activities, setActivities] = useState(mockActivities);

  // Activity
  // //////////////////////////////
  // NOTE: This is a mock of the Strava API response.
  const [activity, setActivity] = useState(mockActivity);
  const handleActivityChange = (id) => {
    const activity = activities.find((activity) => activity.id === id);
    setActivity(activity);
  };

  // Activity Data
  // //////////////////////////////
  // NOTE: This is a mock of the Strava API response.
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
    setPresets(template.presets);
    setPreset(template.presets[0]);
    setInputs(template.variables);
    setVariables({ ...template.presets[0] });
  };

  // Presets
  // //////////////////////////////
  const [presets, setPresets] = useState(template.presets);
  const [preset, setPreset] = useState(presets[0]);
  const handlePresetChange = (value) => {
    const preset = presets.find((preset) => preset.name === value);
    setPreset(preset);
    setVariables({ ...preset });
  };

  // Inputs
  // //////////////////////////////
  const [inputs, setInputs] = useState(template.variables);

  // Variables
  // //////////////////////////////
  const [variables, setVariables] = useState({
    ...template.variables.reduce(
      (object, item) => ({
        ...object,
        [item["name"]]: preset[item["name"]],
      }),
      {}
    ),
  });
  const handleVariableChange = ({ name, value }) => {
    const newVariables = { ...variables, [name]: value };
    const matchingPreset = presets.find((preset) =>
      Object.keys(preset).every((key) => preset[key] === newVariables[key])
    );
    setPreset(matchingPreset ? matchingPreset : { name: "Custom" });
    setVariables({ ...newVariables });
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
        searchTerm={searchTerm}
        template={template}
        templates={templates}
        preset={preset}
        presets={presets}
        inputs={inputs}
        variables={variables}
        onActivityChange={handleActivityChange}
        onAssetChange={handleAssetChange}
        onAssetExport={handleAssetExport}
        onFormatChange={handleFormatChange}
        onSearchChange={handleSearchChange}
        onTemplateChange={handleTemplateChange}
        onPresetChange={handlePresetChange}
        onVariableChange={handleVariableChange}
      />
    </div>
  );
}
