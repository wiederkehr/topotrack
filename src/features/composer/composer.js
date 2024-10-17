"use client";

import { useEffect, useRef, useState } from "react";

import templates from "@/features/templates";
import { toMp4, toPng, toSvg } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import { useStrava } from "@/hooks/useStrava";

import styles from "./composer.module.css";
import { assets, formats } from "./composer.settings";
import Input from "./input";
import Output from "./output";

export default function Composer() {
  const [allActivities, setAllActivities] = useState([]);
  const [visibleActivities, setVisibleActivities] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [activity, setActivity] = useState(null);

  // Activities
  // //////////////////////////////
  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
  } = useStrava("activities", { pageNumber });

  useEffect(() => {
    if (activitiesData) {
      setAllActivities((prev) => [...prev, ...activitiesData]);
      setVisibleActivities((prev) => [...prev, ...activitiesData]);
    }
  }, [activitiesData]);

  const handleLoadMore = () => {
    setPageNumber((prev) => prev + 1);
  };

  // Activity
  // //////////////////////////////
  useEffect(() => {
    if (visibleActivities && visibleActivities?.length > 0) {
      setActivity(visibleActivities[0]);
    }
  }, [visibleActivities]);

  const handleActivityChange = (id) => {
    const activity = allActivities.find((activity) => activity.id === id);
    setActivity(activity);
  };

  // Activity Data
  // //////////////////////////////
  const {
    data: activityData,
    error: activityError,
    loading: activityLoading,
  } = useStrava("activity", { id: activity?.id });

  // Search
  // //////////////////////////////
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value.length >= 3) {
      const matchingActivities = allActivities.filter((activity) =>
        activity.name.toLowerCase().includes(value.toLowerCase()),
      );
      setVisibleActivities(matchingActivities);
    } else {
      setVisibleActivities(allActivities);
    }
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
      {},
    ),
  });
  const handleVariableChange = ({ name, value }) => {
    const newVariables = { ...variables, [name]: value };
    const matchingPreset = presets.find((preset) =>
      Object.keys(preset).every((key) => preset[key] === newVariables[key]),
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
    const name = formatFilename({
      date: activity.start_date_local,
      name: activity.name,
      format: format.name,
      type: asset.type,
    });

    switch (asset.type) {
      case "png":
        toPng({ node: figureRef.current, name, format });
        break;
      case "svg":
        toSvg({ node: figureRef.current, name, format });
        break;
      case "mp4":
        toMp4({ blob: null, name: name, format });
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
        activityError={activityError}
        activityLoading={activityLoading}
        figureRef={figureRef}
        format={format}
        template={template}
        variables={variables}
      />
      <Input
        activity={activity}
        activities={visibleActivities}
        activitiesError={activitiesError}
        activitiesLoading={activitiesLoading}
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
        onLoadMore={handleLoadMore}
        disableLoadMore={activitiesLoading || searchTerm.length >= 3}
      />
    </div>
  );
}
