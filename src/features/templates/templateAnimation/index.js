import { Layer } from "@/features/templates/components/layer";
import {
  MapGLAnimated,
  MapGLStatic,
} from "@/features/templates/components/mapGL";
import { TypeGrid } from "@/features/templates/components/type";
import {
  destructureActivity,
  destructureActivityData,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";

const name = "Animation";

const mapOptions = ["Light", "Dark"];
const mapsStyles = {
  Light: "mapbox://styles/benjaminwiederkehr/clmzlvsu3023i01r81cc979q5",
  Dark: "mapbox://styles/benjaminwiederkehr/cm1o1o9zc00mv01qt0689hvjp",
};

const variables = [
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

const presets = [
  {
    name: "Indigo",
    map: mapOptions[0],
    accent: colors.light.indigo,
    contrast: colors.contrast.light,
  },
  {
    name: "Ruby",
    map: mapOptions[1],
    accent: colors.light.ruby,
    contrast: colors.contrast.dark,
  },
  {
    name: "Teal",
    map: mapOptions[1],
    accent: colors.light.teal,
    contrast: colors.contrast.dark,
  },
];

const Render = ({ activity, activityData, variables, format, size }) => {
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
};

export default {
  name,
  variables,
  presets,
  Render,
};
