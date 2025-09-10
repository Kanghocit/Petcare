"use server";

import { getAllBrands } from "@/libs/brand";

export const getAllBrandsAction = async () => {
  const data = await getAllBrands();
  return data;
};
