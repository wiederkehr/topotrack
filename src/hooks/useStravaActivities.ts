import axios, { AxiosError } from "axios";
import useSWR from "swr";

import type { ActivityType } from "@/types";

const baseUrl = "https://www.strava.com/api/v3/";
const pageLimit = 100;

type UseStravaActivitiesProps = {
  pageNumber: number;
  token: string;
};

type UseStravaActivitiesReturn = {
  data: ActivityType[] | null;
  error: AxiosError | null;
  loading: boolean;
};

type FetcherProps = {
  token?: string;
  url: string;
};

const fetcher = async ({
  url,
  token,
}: FetcherProps): Promise<ActivityType[]> => {
  const args = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get<ActivityType[]>(url, args);
  return response.data;
};

export function useStravaActivities({
  token,
  pageNumber = 1,
}: UseStravaActivitiesProps): UseStravaActivitiesReturn {
  const url = token
    ? `${baseUrl}athlete/activities?page=${pageNumber}&per_page=${pageLimit}`
    : null;
  const fetchWithToken = (url: string) => fetcher({ url, token });
  const { data, error, isLoading } = useSWR<ActivityType[], AxiosError>(
    url,
    fetchWithToken,
  );

  return { data: data ?? null, error: error ?? null, loading: isLoading };
}
