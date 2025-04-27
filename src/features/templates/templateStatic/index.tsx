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
  destructureVariables,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";
import { PresetType, RenderType, VariableType } from "@/types";

// Name
// //////////////////////////////
const name = "Static";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  { label: "Background", name: "background", type: "color" },
  { label: "Accent", name: "accent", type: "color" },
  { label: "Contrast", name: "contrast", type: "color" },
];

// Presets
// //////////////////////////////
const presets: PresetType[] = [
  {
    name: "Tomato",
    background: colors.dark.tomato,
    accent: colors.light.tomato,
    contrast: colors.contrast.dark,
  },
  {
    name: "Red",
    background: colors.dark.red,
    accent: colors.light.red,
    contrast: colors.contrast.dark,
  },
  {
    name: "Ruby",
    background: colors.dark.ruby,
    accent: colors.light.ruby,
    contrast: colors.contrast.dark,
  },
  {
    name: "Crimson",
    background: colors.dark.crimson,
    accent: colors.light.crimson,
    contrast: colors.contrast.dark,
  },
  {
    name: "Pink",
    background: colors.dark.pink,
    accent: colors.light.pink,
    contrast: colors.contrast.dark,
  },
  {
    name: "Plum",
    background: colors.dark.plum,
    accent: colors.light.plum,
    contrast: colors.contrast.dark,
  },
  {
    name: "Purple",
    background: colors.dark.purple,
    accent: colors.light.purple,
    contrast: colors.contrast.dark,
  },
  {
    name: "Violet",
    background: colors.dark.violet,
    accent: colors.light.violet,
    contrast: colors.contrast.dark,
  },
  {
    name: "Iris",
    background: colors.dark.iris,
    accent: colors.light.iris,
    contrast: colors.contrast.dark,
  },
  {
    name: "Indigo",
    background: colors.dark.indigo,
    accent: colors.light.indigo,
    contrast: colors.contrast.dark,
  },
  {
    name: "Blue",
    background: colors.dark.blue,
    accent: colors.light.blue,
    contrast: colors.contrast.dark,
  },
  {
    name: "Cyan",
    background: colors.dark.cyan,
    accent: colors.light.cyan,
    contrast: colors.contrast.dark,
  },
  {
    name: "Teal",
    background: colors.dark.teal,
    accent: colors.light.teal,
    contrast: colors.contrast.dark,
  },
  {
    name: "Jade",
    background: colors.dark.jade,
    accent: colors.light.jade,
    contrast: colors.contrast.dark,
  },
  {
    name: "Green",
    background: colors.dark.green,
    accent: colors.light.green,
    contrast: colors.contrast.dark,
  },
  {
    name: "Grass",
    background: colors.dark.grass,
    accent: colors.light.grass,
    contrast: colors.contrast.dark,
  },
  {
    name: "Gray",
    background: colors.dark.gray,
    accent: colors.light.gray,
    contrast: colors.contrast.dark,
  },
];

// Render
// //////////////////////////////
function Render({ activity, activityData, variables, size }: RenderType) {
  const { latlng } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity);
  const { background, accent, contrast } = destructureVariables(variables);
  const { width, height } = size;
  return (
    <>
      <Layer>
        <SVGContainer width={width} height={height}>
          <SVGBackground width={width} height={height} color={background} />
          <SVGRoute
            data={latlng}
            height={height}
            width={width}
            color={accent}
          />
        </SVGContainer>
      </Layer>
      <Layer>
        <TypeGrid
          name={name}
          type={type}
          day={day}
          year={year}
          distance={distance}
          elevation={elevation}
          state={state}
          country={country}
          accent={accent}
          contrast={contrast}
          width={width}
        />
      </Layer>
    </>
  );
}

// Export
// //////////////////////////////
const template = { name, variables, presets, Render };

export default template;
