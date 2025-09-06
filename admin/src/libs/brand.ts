import { fetchData } from "@/utils/fetchData";
import { Brand } from "@/interface/Brand";

export const getAllBrands = async (page: number, limit: number) => {
  const data = await fetchData(`/brands?page=${page}&limit=${limit}`); 
  return data;
};

export const addBrand = async (brand: Brand) => {
  const data = await fetchData("/brands", "POST", brand);
  return data;
};

export const updateBrand = async (id: string, brand: Brand) => {
  const data = await fetchData(`/brands/${id}`, "PUT", brand);
  return data;
};

export const deleteBrand = async (id: string) => {
  const data = await fetchData(`/brands/${id}`, "DELETE");
  return data;
};
