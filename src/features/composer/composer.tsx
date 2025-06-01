"use client";

import { useEffect, useRef, useState } from "react";

import templates from "@/features/templates";
import { toPng, toSvg } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import { useGetAddress } from "@/hooks/useGetAddress";
import { useStravaActivities } from "@/hooks/useStravaActivities";
import { useStravaActivity } from "@/hooks/useStravaActivity";
import type {
  ActivityType,
  AssetType,
  FormatType,
  PresetType,
  TemplateType,
} from "@/types";

import styles from "./composer.module.css";
import { assets, defaultPreset, formats } from "./composer.settings";
import Error from "./error";
import Input from "./input";
import Output from "./output";

type ComposerProps = {
  token: string;
};

function Composer({ token }: ComposerProps) {
  const [activity, setActivity] = useState<ActivityType | undefined>(undefined);
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityType[]>(
    [],
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Activities
  // //////////////////////////////
  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
  } = useStravaActivities({ token: token ?? "", pageNumber });

  useEffect(() => {
    if (activitiesData && Array.isArray(activitiesData)) {
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
      setActivity(visibleActivities[0] || undefined);
    }
  }, [visibleActivities]);

  const handleActivityChange = (id: number) => {
    const activity = allActivities.find((activity) => activity.id === id);
    setActivity(activity || undefined);
  };

  // Activity Data
  // //////////////////////////////
  const {
    data: activityData,
    error: activityError,
    loading: activityLoading,
  } = useStravaActivity({ token: token ?? "", id: activity?.id ?? null });

  // Activity Address Data
  // //////////////////////////////
  const lat = activity?.start_latlng?.[0] || null;
  const lon = activity?.start_latlng?.[1] || null;
  const { data: activityAddress } = useGetAddress(lat, lon);

  useEffect(() => {
    if (activityData && activityAddress) {
      setActivity((prev) =>
        prev ? { ...prev, address: activityAddress?.address } : undefined,
      );
    }
  }, [activityData, activityAddress]);

  // Search
  // //////////////////////////////
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearchChange = (value: string) => {
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
  const [format, setFormat] = useState<FormatType>(formats[0]!);
  const handleFormatChange = (value: string) => {
    const format = formats.find((format) => format.name === value);
    setFormat(format ?? formats[0]!);
  };

  // Template
  // //////////////////////////////
  const [template, setTemplate] = useState<TemplateType>(templates[0]!);
  const handleTemplateChange = (value: string) => {
    const template = templates.find((template) => template.name === value);
    if (template) {
      const presets = template.presets;
      const preset = template.presets[0];
      setTemplate(template);
      setPresets(presets);
      if (preset) {
        setPreset(preset);
        setVariables(getVariables(template, preset));
      }
    }
  };

  // Presets
  // //////////////////////////////
  const [presets, setPresets] = useState<PresetType[]>(template.presets);
  const [preset, setPreset] = useState<PresetType>(presets[0] || defaultPreset);
  const handlePresetChange = (value: string) => {
    const preset = (presets ?? []).find((preset) => preset.name === value);
    if (preset) {
      setPreset(preset);
      setVariables(getVariables(template, preset));
    }
  };

  // Variables
  // //////////////////////////////
  const [variables, setVariables] = useState(
    template.variables.map((variable) => {
      return {
        ...variable,
        value: preset ? preset[variable.name] : "",
      };
    }),
  );
  const handleVariableChange = (newVariable: {
    name: string;
    value: string;
  }) => {
    const newVariables = variables.map((oldVariable) =>
      oldVariable.name === newVariable.name
        ? { ...oldVariable, value: newVariable.value }
        : oldVariable,
    );
    const matchingPreset = presets.find((preset) => {
      return Object.keys(preset).every((key) => {
        return (
          newVariables.find((variable) => variable.name === key)?.value ===
          preset[key]
        );
      });
    });
    setPreset(matchingPreset || defaultPreset);
    setVariables(newVariables);
  };
  const getVariables = (template: TemplateType, preset: PresetType) => {
    const variables = template.variables.map((variable) => {
      return {
        ...variable,
        value: preset[variable.name],
      };
    });
    return variables;
  };

  // Export
  // //////////////////////////////
  const figureRef = useRef<HTMLDivElement>(null);
  const [asset, setAsset] = useState<AssetType>(assets[0]!);
  const handleAssetChange = (value: string) => {
    const asset = assets.find((asset) => asset.name === value);
    setAsset(asset || assets[0]!);
  };
  const handleAssetExport = () => {
    if (!activity) return;

    const name = formatFilename({
      date: activity.start_date_local,
      name: activity.name,
      format: format?.name || "Custom",
      type: asset?.type || "png",
    });

    switch (asset?.type) {
      case "png":
        void toPng({ node: figureRef.current!, name, format });
        break;
      case "svg":
        void toSvg({ node: figureRef.current!, name, format });
        break;
      default:
        break;
    }
  };

  if (activitiesError && activitiesError.response?.status === 401) {
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
