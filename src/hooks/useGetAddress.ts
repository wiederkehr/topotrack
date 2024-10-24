import axios from "axios";
import useSWR from "swr";

export const baseUrl = "https://nominatim.openstreetmap.org/";

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

type UseGetAddressResult = {
  data: any;
  error: any;
  loading: boolean;
};

function useGetAddress(
  lat: number | null,
  lon: number | null,
): UseGetAddressResult {
  const url =
    lat && lon
      ? `${baseUrl}reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
      : null;
  const { data, error, isLoading: loading } = useSWR(url, fetcher);

  return { data, error, loading };
}

export { useGetAddress };
