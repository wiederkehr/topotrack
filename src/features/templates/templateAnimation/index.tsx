import { Layer } from "@/features/templates/components/layer";
import { MapGLAnimated } from "@/features/templates/components/mapGL";
import { TypeGrid } from "@/features/templates/components/type";
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
  contrast: string;
  map: string;
};

type PresetType = VariablesType & {
  name: string;
};

type RenderProps = RenderBaseProps & {
  variables: VariablesType;
};

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
}: RenderProps) {
  const { latlng } = destructureActivityData(activityData);
  const { name, type, distance, elevation, state, country, day, year } =
    destructureActivity(activity);
  const { map, accent, contrast } = variables;
  const { width } = size;
  return (
    <>
      <Layer>
        <MapGLAnimated
          data={latlng}
          style={mapsStyles[map]}
          accent={accent}
          contrast={contrast}
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
const template = {
  name,
  variables,
  presets,
  Render,
};

export default template;
