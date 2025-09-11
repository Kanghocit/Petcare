"use server";

import { getAllBrands } from "@/libs/brand";

export const getAllBrandsActions = async (page: number, limit: number) => {
  const data = await getAllBrands(page, limit);
  return data;
};
