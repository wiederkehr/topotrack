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
import { generateColorPresets } from "@/functions/presets";
import { OverrideType, RenderType, VariableType } from "@/types";

// Name
// //////////////////////////////
const name = "Static 1.0";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  { label: "Background", name: "background", type: "color" },
  { label: "Accent", name: "accent", type: "color" },
  { label: "Contrast", name: "contrast", type: "color" },
];

// Overrides
// //////////////////////////////
const overrides: OverrideType[] = [];

// Presets
// //////////////////////////////
const presets = generateColorPresets({
  background: "dark",
  accent: "light",
  contrast: "contrast",
});

// Render
// //////////////////////////////
function Render({
  activity,
  activityData,
  variables,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  overrides: _overrides,
  size,
  format,
  units,
}: RenderType) {
  const { latlng, altitude } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity, units);
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
const template = { name, variables, overrides, presets, Render };

export default template;
