import { ActivityStreamsType } from "@/types";

type DestructuredActivityData = {
  altitude: number[];
  cadence: number[];
  distance: number[];
  grade_smooth: number[];
  heartrate: number[];
  latlng: [number, number][];
  moving: number[];
  temp: number[];
  time: number[];
  velocity_smooth: number[];
  watts: number[];
};

function destructureActivityData(
  activityData: ActivityStreamsType,
): DestructuredActivityData {
  const altitude = (activityData?.altitude?.data ?? []) as number[];
  const distance = (activityData?.distance?.data ?? []) as number[];
  const latlng = (activityData?.latlng?.data ?? []) as [number, number][];
  const time = (activityData?.time?.data ?? []) as number[];
  const cadence = (activityData?.cadence?.data ?? []) as number[];
  const grade_smooth = (activityData?.grade_smooth?.data ?? []) as number[];
  const heartrate = (activityData?.heartrate?.data ?? []) as number[];
  const moving = (activityData?.moving?.data ?? []) as number[];
  const temp = (activityData?.temp?.data ?? []) as number[];
  const velocity_smooth = (activityData?.velocity_smooth?.data ??
    []) as number[];
  const watts = (activityData?.watts?.data ?? []) as number[];
  return {
    latlng,
    distance,
    altitude,
    time,
    cadence,
    grade_smooth,
    heartrate,
    moving,
    temp,
    velocity_smooth,
    watts,
  };
}

export { destructureActivityData };
