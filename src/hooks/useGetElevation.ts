// Skip all tsx linting rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import axios from "axios";
import useSWR from "swr";

const baseUrl = "https://www.elevation-api.eu/v1/elevation";

type FetcherParams = {
  activity: string;
  locations: string;
};

const fetcher = async ({ activity, locations }: FetcherParams) => {
  try {
    const response = await axios.get(baseUrl + `?pts=${locations}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

type UseGetElevationResult = {
  data: any;
  error: any;
  loading: boolean;
};

function useGetElevation(
  activity: string,
  latlng: [number, number][],
): UseGetElevationResult {
  const points = latlng.map((item) => `[${item[0]},${item[1]}]`).join(",");
  const locations = `[${points}]`;

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR({ activity, locations }, fetcher);

  return { data, error, loading };
}

export { useGetElevation };
