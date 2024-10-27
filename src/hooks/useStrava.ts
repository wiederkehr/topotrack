import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { mockActivities, mockActivitiesData } from "@/data/mock";

export const baseUrl = "https://www.strava.com/api/v3/";
export const pageLimit = 20;

type FetcherProps = {
  token: string;
  url: string;
};

const fetcher = async ({ url, token }: FetcherProps) => {
  const args = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.get(url, args);
    return response.data;
  } catch (error) {
    throw error;
  }
};

type UseStravaProps = {
  params: { id?: number; pageNumber?: number; url?: string };
  type: string;
};

export const useStrava = ({ type, params }: UseStravaProps) => {
  const { data: session } = useSession();
  const token = session?.access_token;

  let url;

  switch (type) {
    case "activities":
      url = `${baseUrl}athlete/activities?page=${params.pageNumber}&per_page=${pageLimit}`;
      break;
    case "activity":
      url = `${baseUrl}activities/${params.id}/streams?keys=[time,distance,latlng,altitude]`;
      break;
    case "*":
      url = params.url;
      break;
    default:
      throw new Error("Invalid type provided to useStrava hook");
  }

  const fetcherWithToken = (url: string) =>
    fetcher({ url, token: token || "" });
  const { data, error, isLoading: loading } = useSWR(url, fetcherWithToken);

  return { data, error, loading };
};

export const useMockStrava = ({ type, params }: UseStravaProps) => {
  switch (type) {
    case "activities":
      return { data: mockActivities, error: null, loading: false };
    case "activity":
      const mockActivity = mockActivitiesData.find(
        (activityData) => activityData.id === params.id,
      );
      return { data: mockActivity?.data, error: null, loading: false };
    default:
      throw new Error("Invalid type provided to useMockStrava hook");
  }
};
