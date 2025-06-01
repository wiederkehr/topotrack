import axios, { AxiosError } from "axios";
import useSWR from "swr";

import type { ActivityDataType } from "@/types";

const baseUrl = "https://www.strava.com/api/v3/";

type UseStravaActivityProps = {
  id: number | null;
  token: string;
};

type UseStravaActivityReturn = {
  data: ActivityDataType[] | null;
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
}: FetcherProps): Promise<ActivityDataType[]> => {
  const args = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get<ActivityDataType[]>(url, args);
  return response.data;
};

export function useStravaActivity({
  token,
  id,
}: UseStravaActivityProps): UseStravaActivityReturn {
  const url =
    id && token
      ? `${baseUrl}activities/${id}/streams?keys=[time,distance,latlng,altitude]`
      : null;
  const fetchWithToken = (url: string) => fetcher({ url, token });
  const { data, error, isLoading } = useSWR<ActivityDataType[], AxiosError>(
    url,
    fetchWithToken,
  );

  return { data: data ?? null, error: error ?? null, loading: isLoading };
}
