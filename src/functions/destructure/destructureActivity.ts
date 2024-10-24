import { formatMeters, formatMonthDay, formatYear } from "@/functions/format";

type Activity = {
  address?: {
    country?: string;
    state?: string;
  };
  distance?: number;
  name?: string;
  start_date_local?: string;
  total_elevation_gain?: number;
  type?: string;
};

type DestructuredActivity = {
  country: string;
  day: string;
  distance: string;
  elevation: string;
  name: string;
  state: string;
  type: string;
  year: string;
};

function destructureActivity(activity: Activity): DestructuredActivity {
  const name = activity?.name || "No name";
  const type = activity?.type || "No type";
  const distance = activity?.distance
    ? formatMeters(activity?.distance)
    : "No distance";
  const elevation = activity?.total_elevation_gain
    ? formatMeters(activity?.total_elevation_gain)
    : "No elevation";
  const state = activity?.address?.state || "No state";
  const country = activity?.address?.country || "No country";
  const day = activity?.start_date_local
    ? formatMonthDay(activity?.start_date_local)
    : "No date";
  const year = activity?.start_date_local
    ? formatYear(activity?.start_date_local)
    : "No date";
  return { name, type, distance, elevation, state, country, day, year };
}

export { destructureActivity };
