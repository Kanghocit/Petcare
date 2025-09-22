import { fetchData } from "@/utils/fetchData";

export const getStatistics = async (startDate: string, endDate: string) => {
  const data = await fetchData(
    `/statistics?startDate=${startDate}&endDate=${endDate}`,
  );
  return data?.stats ?? data;
};
