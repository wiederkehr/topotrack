import { Layer } from "@/features/templates/components/layer";
import { MapGLAnimated } from "@/features/templates/components/mapGL";
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
const name = "Animation";

// Variables
// //////////////////////////////
const mapOptions: string[] = ["Light", "Dark"];
const mapsStyles: { Dark: string; Light: string } = {
  Light: "mapbox://styles/benjaminwiederkehr/clmzlvsu3023i01r81cc979q5",
  Dark: "mapbox://styles/benjaminwiederkehr/cm1o1o9zc00mv01qt0689hvjp",
};

const variables: VariableType[] = [
  {
    label: "Map",
    name: "map",
    options: mapOptions,
    type: "select",
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
    map: mapOptions[0] as string,
    accent: colors.light.indigo,
    contrast: colors.contrast.light,
  },
  {
    name: "Ruby",
    map: mapOptions[1] as string,
    accent: colors.light.ruby,
    contrast: colors.contrast.dark,
  },
  {
    name: "Teal",
    map: mapOptions[1] as string,
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
}: RenderType) {
  const { latlng } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity);
  const { map, accent, contrast } = destructureVariables(variables);
  // const { map, accent, contrast } = variables as {
  //   accent: string;
  //   contrast: string;
  //   map: keyof typeof mapsStyles;
  // };
  const { width } = size;
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
  const mapStyle = mapsStyles[map as keyof typeof mapsStyles];
  return (
    <>
      <Layer>
        <MapGLAnimated
          data={latlng}
          style={mapStyle}
          accent={accent ?? "#FFF"}
          contrast={contrast ?? "#FFF"}
          format={format}
        />
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
          padding={padding}
          factor={factor}
          fontSize={defaultFontSize * factor}
        />
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
