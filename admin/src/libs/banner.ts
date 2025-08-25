import { Banner } from "@/interface/Banner";
import { fetchData } from "@/utils/fetchData";

export const getAllBanners = async () => {
  const data = await fetchData("/banners");
  return data;
};

export const createBanner = async (banner: Banner) => {
  const data = await fetchData("/banners", "POST", banner);
  return data;
};

export const updateBanner = async (id: string, banner: Banner) => {
  const data = await fetchData(`/banners/${id}`, "PATCH", banner);
  return data;
};

export const deleteBanner = async (id: string) => {
  const data = await fetchData(`/banners/${id}`, "DELETE");
  return data;
};
