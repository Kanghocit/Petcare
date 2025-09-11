import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllAddress = async (page: number, limit: number) => {
  const data = await fetchWithoutToken(`/address?page=${page}&limit=${limit}`);
  return data;
};
