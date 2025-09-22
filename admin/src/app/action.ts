import { getStatistics } from "@/libs/statistic";

export const getStatisticsAction = async (
  startDate?: string,
  endDate?: string,
) => {
  const data = await getStatistics(
    startDate || "2025-01-01",
    endDate || "2025-12-31",
  );
  return data;
};
