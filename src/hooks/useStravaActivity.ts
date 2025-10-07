import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { activityStreamsSchema } from "@/schemas/strava";
import type { ActivityStreamsType } from "@/types";

const baseUrl = "https://www.strava.com/api/v3/";

type UseStravaActivityProps = {
  id: number | null;
  token: string;
};

type UseStravaActivityReturn = {
  data: ActivityStreamsType | null;
  error: AxiosError | null;
  loading: boolean;
};

type FetcherProps = {
  token: string;
  url: string;
};

const fetcher = async ({
  url,
  token,
}: FetcherProps): Promise<ActivityStreamsType> => {
  const args = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get<ActivityStreamsType>(url, args);

  // Validate response data with Zod
  const validated = activityStreamsSchema.parse(response.data);
  return validated;
};

export function useStravaActivity({
  token,
  id,
}: UseStravaActivityProps): UseStravaActivityReturn {
  const url =
    id && token
      ? `${baseUrl}activities/${id}/streams?keys=[time,distance,latlng,altitude,velocity_smooth,heartrate,cadence,watts,temp,moving,grade_smooth]&key_by_type=true`
      : null;
  const fetchWithToken = (url: string) => fetcher({ url, token });
  const { data, error, isLoading } = useSWR<ActivityStreamsType, AxiosError>(
    url,
    fetchWithToken,
  );

  return { data: data ?? null, error: error ?? null, loading: isLoading };
}
