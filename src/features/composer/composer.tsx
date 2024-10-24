"use client";

import { useEffect, useRef, useState } from "react";

import templates from "@/features/templates";
import { toMp4, toPng, toSvg } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import { useGetAddress } from "@/hooks/useGetAddress";
import { useStrava } from "@/hooks/useStrava";

import styles from "./composer.module.css";
import { assets, formats } from "./composer.settings";
import Error from "./error";
import Input from "./input";
import Output from "./output";

type ActivityType = {
  id: string;
  name: string;
  start_date_local: string;
  start_latlng?: [number, number];
};

type FormatType = {
  height: number;
  name: string;
  width: number;
};

type TemplateType = {
  Render: React.ComponentType<any>;
  name: string;
  presets: PresetType[];
  variables: VariableType[];
};

type PresetType = {
  [key: string]: any;
  name: string;
};

type VariableType = {
  name: string;
  options?: string[];
  type: "select" | "color";
};

type AssetType = {
  name: string;
  type: string;
};

function Composer() {
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityType[]>(
    [],
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [activity, setActivity] = useState<ActivityType | null>(null);

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
    if (visibleActivities && visibleActivities.length > 0) {
      setActivity(visibleActivities[0]);
    }
  }, [visibleActivities]);

  const handleActivityChange = (id: string) => {
    const activity = allActivities.find((activity) => activity.id === id);
    setActivity(activity || null);
  };

  // Activity Data
  // //////////////////////////////
  const {
    data: activityData,
    error: activityError,
    loading: activityLoading,
  } = useStrava("activity", { id: activity?.id });

  // Activity Address Data
  // //////////////////////////////
  const lat = activity?.start_latlng?.[0];
  const lon = activity?.start_latlng?.[1];
  const {
    data: activityAddress,
    error: activityAddressError,
    loading: activityAddressLoading,
  } = useGetAddress(lat, lon);

  useEffect(() => {
    if (activityData && activityAddress) {
      setActivity((prev) =>
        prev ? { ...prev, address: activityAddress?.address } : null,
      );
    }
  }, [activityData, activityAddress]);

  // Search
  // //////////////////////////////
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const [format, setFormat] = useState<FormatType>(formats[0]);
  const handleFormatChange = (value: string) => {
    const format = formats.find((format) => format.name === value);
    setFormat(format || formats[0]);
  };

  // Template
  // //////////////////////////////
  const [template, setTemplate] = useState<TemplateType>(templates[0]);
  const handleTemplateChange = (value: string) => {
    const template = templates.find((template) => template.name === value);
    if (template) {
      setTemplate(template);
      setPresets(template.presets);
      setPreset(template.presets[0]);
      setInputs(template.variables);
      setVariables({ ...template.presets[0] });
    }
  };

  // Presets
  // //////////////////////////////
  const [presets, setPresets] = useState<PresetType[]>(template.presets);
  const [preset, setPreset] = useState<PresetType>(presets[0]);
  const handlePresetChange = (value: string) => {
    const preset = presets.find((preset) => preset.name === value);
    if (preset) {
      setPreset(preset);
      setVariables({ ...preset });
    }
  };

  // Inputs
  // //////////////////////////////
  const [inputs, setInputs] = useState<VariableType[]>(template.variables);

  // Variables
  // //////////////////////////////
  const [variables, setVariables] = useState<{ [key: string]: any }>({
    ...template.variables.reduce(
      (object, item) => ({
        ...object,
        [item.name]: preset[item.name],
      }),
      {},
    ),
  });
  const handleVariableChange = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    const newVariables = { ...variables, [name]: value };
    const matchingPreset = presets.find((preset) =>
      Object.keys(preset).every((key) => preset[key] === newVariables[key]),
    );
    setPreset(matchingPreset ? matchingPreset : { name: "Custom" });
    setVariables({ ...newVariables });
  };

  // Export
  // //////////////////////////////
  const figureRef = useRef<HTMLDivElement>(null);
  const [asset, setAsset] = useState<AssetType>(assets[0]);
  const handleAssetChange = (value: string) => {
    const asset = assets.find((asset) => asset.name === value);
    setAsset(asset || assets[0]);
  };
  const handleAssetExport = () => {
    if (!activity) return;

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

  if (activitiesError && activitiesError.response.status === 401) {
    return <Error />;
  }

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

export default Composer;
