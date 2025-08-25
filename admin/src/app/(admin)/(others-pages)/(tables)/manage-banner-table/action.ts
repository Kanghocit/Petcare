"use server";

import { createBanner, getAllBanners, updateBanner } from "@/libs/banner";
import { deleteBanner } from "@/libs/banner";
import { Banner } from "@/interface/Banner";

export const getAllBannersAction = async () => {
  const data = await getAllBanners();
  return data;
};

export const createBannerAction = async (banner: Banner) => {
  const data = await createBanner(banner);
  return data;
};

export const updateBannerAction = async (id: string, banner: Banner) => {
  const data = await updateBanner(id, banner);
  return data;
};

export const deleteBannerAction = async (id: string) => {
  const data = await deleteBanner(id);
  return data;
};
