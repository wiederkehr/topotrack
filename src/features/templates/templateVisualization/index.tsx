import { Layer } from "@/features/templates/components/layer";
import {
  SVGBackground,
  SVGContainer,
} from "@/features/templates/components/svg";
import { RenderBaseProps, VariableType } from "@/features/templates/types";
import {
  destructureActivity,
  destructureActivityData,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";

// Types
// //////////////////////////////
type VariablesType = {
  accent: string;
  background: string;
  contrast: string;
};

type PresetType = VariablesType & {
  name: string;
};

type RenderProps = RenderBaseProps & {
  variables: VariablesType;
};

// Name
// //////////////////////////////
const name = "Visualization";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  {
    label: "Background",
    name: "background",
    type: "color",
  },
  {
    label: "Accent",
    name: "accent",
    type: "color",
  },
  {
    label: "Contrast",
    name: "contrast",
    type: "color",
  },
];

// Presets
// //////////////////////////////
const presets: PresetType[] = [
  {
    name: "Indigo",
    background: colors.dark.indigo,
    accent: colors.light.indigo,
    contrast: colors.contrast.dark,
  },
  {
    name: "Ruby",
    background: colors.dark.ruby,
    accent: colors.light.ruby,
    contrast: colors.contrast.dark,
  },
  {
    name: "Teal",
    background: colors.dark.teal,
    accent: colors.light.teal,
    contrast: colors.contrast.dark,
  },
];

// Render
// //////////////////////////////
function Render({
  activity,
  activityData,
  variables,
  format,
  size,
}: RenderProps) {
  const { latlng } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity);
  const { background, accent, contrast } = variables;
  const { width, height } = size;
  return (
    <>
      <Layer>
        <SVGContainer width={width} height={height}>
          <SVGBackground width={width} height={height} color={background} />
        </SVGContainer>
      </Layer>
    </>
  );
}

// Export
// //////////////////////////////
const template = {
  name,
  variables,
  presets,
  Render,
};

export default template;
