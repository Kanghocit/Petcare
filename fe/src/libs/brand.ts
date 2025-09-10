import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllBrands = async () => {
  const data = await fetchWithoutToken("/brands");
  return data;
};
