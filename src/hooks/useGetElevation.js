import axios from "axios";
import useSWR from "swr";

const baseUrl = "https://www.elevation-api.eu/v1/elevation";

const fetcher = async ({ activity, locations }) => {
  try {
    const response = await axios.get(baseUrl + `?pts=${locations}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetElevation = (activity, latlng) => {
  const points = latlng.map((item) => `[${item[0]},${item[1]}]`).join(",");
  const locations = `[${points}]`;

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR({ activity, locations }, fetcher);

  return { data, error, loading };
};
