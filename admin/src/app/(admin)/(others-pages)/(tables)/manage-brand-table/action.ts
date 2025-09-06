"use server";

import { Brand } from "@/interface/Brand";
import { addBrand, getAllBrands, updateBrand, deleteBrand } from "@/libs/brand";

export const getAllBrandsAction = async (page: number, limit: number) => {
  const data = await getAllBrands(page, limit);
  return data;
};

export const addBrandAction = async (brand: Brand) => {
  const data = await addBrand(brand);
  return data;
};
export const updateBrandAction = async (id: string, brand: Brand) => {
  const data = await updateBrand(id, brand);
  return data;
};

export const deleteBrandAction = async (id: string) => {
  const data = await deleteBrand(id);
  return data;
};
