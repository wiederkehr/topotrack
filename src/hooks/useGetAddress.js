import axios from "axios";
import useSWR from "swr";

export const baseUrl = "https://nominatim.openstreetmap.org/";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetAddress = (lat, lon) => {
  const url =
    lat && lon
      ? `${baseUrl}reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
      : null;
  const { data, error, isLoading: loading } = useSWR(url, fetcher);

  return { data, error, loading };
};
