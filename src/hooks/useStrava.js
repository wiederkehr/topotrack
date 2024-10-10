import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const baseUrl = "https://www.strava.com/api/v3/";

const fetcher = ({ url, args }) => axios.get(url, args).then((res) => res.data);

export const useStrava = (path) => {
  const { data: session } = useSession();
  const accessToken = session?.access_token;

  if (!path) {
    throw new Error("Path is required");
  }

  const args = { headers: { Authorization: `Bearer ${accessToken}` } };
  const url = baseUrl + path;
  const { data, error, isLoading: loading } = useSWR({ url, args }, fetcher);
  return { data, error, loading };
};
