import { fetchData } from "@/utils/fetchData";

export const getStatistics = async (
  startDate: string,
  endDate: string,
  type: string,
) => {
  const data = await fetchData(
    `/statistics?startDate=${startDate}&endDate=${endDate}&type=${type}`,
  );
  return data?.stats ?? data;
};
