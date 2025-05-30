import { ActivityDataType } from "@/types";

type DestructuredActivityData = {
  altitude: number[];
  distance: number[];
  latlng: [];
  time: number[];
};

function destructureActivityData(
  activityData: ActivityDataType[],
): DestructuredActivityData {
  const latlng = activityData?.find((d) => d.type === "latlng")?.data || [];
  const distance = activityData?.find((d) => d.type === "distance")?.data || [];
  const altitude = activityData?.find((d) => d.type === "altitude")?.data || [];
  const time = activityData?.find((d) => d.type === "time")?.data || [];
  return { latlng, distance, altitude, time };
}

export { destructureActivityData };
