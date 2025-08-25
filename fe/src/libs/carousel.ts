import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllBanners = async () => {
  const data = await fetchWithoutToken("/banners");
  return data;
};
