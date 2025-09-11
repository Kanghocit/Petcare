import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllBrands = async (page: number, limit: number) => {
  const data = await fetchWithoutToken(`/brands?page=${page}&limit=${limit}`);
  return data;
};
