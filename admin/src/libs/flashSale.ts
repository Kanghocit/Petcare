import { CreateFlashSaleRequest } from "@/interface/FlashSales";
import { fetchData } from "@/utils/fetchData";

export const getFlashSale = async (
  page: number,
  limit: number,
  search: string,
) => {
  const data = await fetchData(
    `/flash-sale?page=${page}&limit=${limit}&search=${search}`,
  );
  return data;
};

export const createFlashSale = async (flashSale: CreateFlashSaleRequest) => {
  const data = await fetchData("/flash-sale", "POST", flashSale);
  return data;
};

export const getFlashSaleById = async (id: string) => {
  const data = await fetchData(`/flash-sale/${id}`);
  return data;
};

export const updateFlashSale = async (
  id: string,
  flashSale: CreateFlashSaleRequest,
) => {
  const data = await fetchData(`/flash-sale/${id}`, "PUT", flashSale);
  return data;
};

export const deleteFlashSale = async (id: string) => {
  const data = await fetchData(`/flash-sale/${id}`, "DELETE");
  return data;
};

export const toggleFlashSaleStatus = async (id: string, status: string) => {
  const data = await fetchData(`/flash-sale/${id}/status`, "PATCH", { status });
  return data;
};
