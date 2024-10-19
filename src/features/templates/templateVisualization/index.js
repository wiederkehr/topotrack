import { Layer } from "@/features/templates/components/layer";
import {
  SVGBackground,
  SVGContainer,
  SVGRoute,
} from "@/features/templates/components/svg";
import { TypeGrid } from "@/features/templates/components/type";
import {
  destructureActivity,
  destructureActivityData,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";

const name = "Visualization";

const variables = [
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

const presets = [
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

const Render = ({ activity, activityData, variables, format, size }) => {
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
};

export default {
  name,
  variables,
  presets,
  Render,
};
