import useSWR from "swr";
import axios from "axios";
import { useSession } from "next-auth/react";

const baseUrl = "https://www.strava.com/api/v3/";

const fetcher = ({ url, args }) => axios.get(url, args).then((res) => res.data);

export const useStrava = (path) => {
  if (!path) {
    throw new Error("Path is required");
  }

  const { data: session } = useSession();
  const accessToken = session.accessToken;
  const userID = session.user.id;

  const args = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const url = baseUrl + path;

  const { data, error } = useSWR({ url, args }, fetcher);

  return { data, error };
};
