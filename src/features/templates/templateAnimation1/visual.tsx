// Skip all tsx linting rules
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import chroma from "chroma-js";

// import { Layer } from "@/features/visuals/layer";
// import { MapGLAnimated } from "@/features/visuals/map";
// import {
//   MapShadeType,
//   mapStyle,
//   mapStyleOptions,
// } from "@/features/visuals/map/styles/minimal";
// import { getPadding } from "@/features/visuals/padding";
// import {
//   destructureActivityData,
//   destructureVariables,
// } from "@/functions/destructure";
// import { colors } from "@/styles/constants";
// import { VisualType } from "@/types";

// // Visual
// // //////////////////////////////
// export function Visual({ activityData, variables, format }: VisualType) {
//   const {
//     foreground = colors.mono.white,
//     middleground = colors.light.indigo,
//     background = colors.dark.indigo,
//     map = mapStyleOptions[0],
//   } = destructureVariables(variables);
//   const { lnglat } = destructureActivityData(activityData);
//   const padding = getPadding(format.name);
//   const routeForeground = chroma(foreground).mix(middleground, 0.2).hex();
//   const routeBackground = chroma(middleground).mix(background, 0.6).hex();
//   return (
//     <Layer>
//       <MapGLAnimated
//         key={format.name}
//         data={lnglat}
//         padding={padding}
//         style={mapStyle({ mapShade: map as MapShadeType })}
//         routeColor={routeBackground}
//         progressColor={routeForeground}
//       />
//     </Layer>
//   );
// }
