import { Layer } from "@/features/templates/components/layer";
import {
  SVGBackground,
  SVGContainer,
  SVGGroup,
  SVGProfile,
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
    name: "Gray",
    background: colors.dark.gray,
    accent: colors.light.gray,
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
    name: "Sky",
    background: colors.dark.sky,
    accent: colors.light.sky,
    contrast: colors.contrast.dark,
  },
  {
    name: "Cyan",
    background: colors.dark.cyan,
    accent: colors.light.cyan,
    contrast: colors.contrast.dark,
  },
  {
    name: "Mint",
    background: colors.dark.mint,
    accent: colors.light.mint,
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
    name: "Lime",
    background: colors.dark.lime,
    accent: colors.light.lime,
    contrast: colors.contrast.dark,
  },
  {
    name: "Yellow",
    background: colors.dark.yellow,
    accent: colors.light.yellow,
    contrast: colors.contrast.dark,
  },
  {
    name: "Amber",
    background: colors.dark.amber,
    accent: colors.light.amber,
    contrast: colors.contrast.dark,
  },
  {
    name: "Orange",
    background: colors.dark.orange,
    accent: colors.light.orange,
    contrast: colors.contrast.dark,
  },
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
];

// Render
// //////////////////////////////
function Render({
  activity,
  activityData,
  variables,
  size,
  format,
}: RenderType) {
  const { latlng, altitude } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity);
  const { background, accent, contrast } = destructureVariables(variables);
  const { width, height } = size;
  const factor = width / format.width;
  const defaultPadding = 40;
  const defaultFontSize = 40;
  const storyVerticalPadding = 250;
  const padding = {
    top:
      format.name === "Story"
        ? storyVerticalPadding * factor
        : defaultPadding * factor,
    bottom:
      format.name === "Story"
        ? storyVerticalPadding * factor
        : defaultPadding * factor,
    left: defaultPadding * factor,
    right: defaultPadding * factor,
  };
  const twoLinesOfText = defaultFontSize * factor * 2;
  const routeMarginTop = twoLinesOfText;
  const profileMarginBottom = twoLinesOfText;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight =
    height -
    padding.top -
    routeMarginTop -
    padding.bottom -
    profileMarginBottom;
  const routeHeight = innerHeight;
  const routeYStart = padding.top + routeMarginTop;
  const profileHeight = innerHeight * 0.2;
  const profileYStart =
    height - padding.bottom - profileMarginBottom - profileHeight;
  const strokeWidth = width * 0.004;
  return (
    <>
      <Layer>
        <SVGContainer width={width} height={height}>
          <SVGBackground
            color={background ?? "#000"}
            height={height}
            width={width}
          />
          <SVGGroup transform={`translate(${padding.left}, ${routeYStart})`}>
            <SVGRoute
              data={latlng}
              height={routeHeight}
              width={innerWidth}
              strokeColor={accent ?? "#FFF"}
              strokeWidth={strokeWidth}
            />
          </SVGGroup>
          <SVGGroup
            transform={`translate(${padding.left}, ${profileYStart})`}
            style={{ opacity: 0.4 } as React.CSSProperties}
          >
            <SVGProfile
              data={altitude}
              height={profileHeight}
              width={innerWidth}
              strokeColor={accent ?? "#FFF"}
              strokeWidth={strokeWidth}
            />
          </SVGGroup>
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
          accent={accent ?? "#FFF"}
          contrast={contrast ?? "#FFF"}
          width={width}
          factor={factor}
          padding={padding}
          fontSize={defaultFontSize * factor}
        />
      </Layer>
    </>
  );
}

// Export
// //////////////////////////////
const template = { name, variables, presets, Render };

export default template;
