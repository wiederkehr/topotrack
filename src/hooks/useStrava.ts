import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { mockActivities, mockActivitiesData } from "@/data/mock";
import type { ActivityType } from "@/types";

export const baseUrl = "https://www.strava.com/api/v3/";
export const pageLimit = 20;

type FetcherProps = {
  token: string;
  url: string;
};

const fetcher = async ({
  url,
  token,
}: FetcherProps): Promise<ActivityType[]> => {
  const args = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.get<ActivityType[]>(url, args);
    return response.data;
  } catch (error) {
    throw error;
  }
};

type UseStravaProps = {
  params: { id?: number; pageNumber?: number; url?: string };
  token: string;
  type: string;
};

export type UseStravaReturn = {
  data: ActivityType[] | null;
  error: AxiosError | null;
  loading: boolean;
};

export const useStrava = ({
  type,
  token,
  params,
}: UseStravaProps): UseStravaReturn => {
  let url: string | null = null;

  switch (type) {
    case "activities":
      url = `${baseUrl}athlete/activities?page=${params.pageNumber}&per_page=${pageLimit}`;
      break;
    case "activity":
      url = `${baseUrl}activities/${params.id}/streams?keys=[time,distance,latlng,altitude]`;
      break;
    case "*":
      url = params.url || null;
      break;
    default:
      throw new Error("Invalid type provided to useStrava hook");
  }

  const fetcherWithToken = (url: string) =>
    fetcher({ url, token: token || "" });
  const { data, error, isLoading } = useSWR<ActivityType[], AxiosError>(
    url,
    fetcherWithToken,
  );

  return { data: data || null, error: error || null, loading: isLoading };
};

export const useMockStrava = ({
  type,
  params,
}: UseStravaProps): UseStravaReturn => {
  switch (type) {
    case "activities":
      return {
        data: mockActivities.map((activity) => ({
          ...activity,
          start_latlng: activity.start_latlng as [number, number],
        })) as ActivityType[],
        error: null,
        loading: false,
      };
    case "activity":
      const mockActivity = mockActivitiesData.find(
        (activityData) => activityData.id === params.id,
      );
      return {
        data: mockActivity?.data
          ? [
              {
                id: params.id || 0,
                name: "Mock Activity",
                start_date_local: new Date().toISOString(),
                ...mockActivity.data,
              } as ActivityType,
            ]
          : null,
        error: null,
        loading: false,
      };
    default:
      throw new Error("Invalid type provided to useMockStrava hook");
  }
};
