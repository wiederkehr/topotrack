import axios, { AxiosError } from "axios";
import useSWR from "swr";

export const baseUrl = "https://nominatim.openstreetmap.org/";

const fetcher = async (url: string): Promise<ReverseGeocodeResponse> => {
  const response = await axios.get<ReverseGeocodeResponse>(url);
  return response.data;
};

type ReverseGeocodeResponse = {
  address: {
    [key: string]: string | undefined;
    city?: string;
    country?: string;
    postcode?: string;
    state?: string;
  };
  display_name: string;
  lat: string;
  lon: string;
};

type UseGetAddressReturn = {
  data: ReverseGeocodeResponse | null;
  error: AxiosError | null;
  loading: boolean;
};

function useGetAddress(
  lat: number | null,
  lon: number | null,
): UseGetAddressReturn {
  const url =
    lat && lon
      ? `${baseUrl}reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
      : null;

  const { data, error, isLoading } = useSWR<ReverseGeocodeResponse, AxiosError>(
    url,
    fetcher,
  );

  return { data: data || null, error: error || null, loading: isLoading };
}

export { useGetAddress };
