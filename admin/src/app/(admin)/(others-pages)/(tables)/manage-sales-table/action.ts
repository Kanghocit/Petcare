"use server";

import { CreateFlashSaleRequest } from "@/interface/FlashSales";
import {
  createFlashSale,
  getFlashSale,
  getFlashSaleById,
  updateFlashSale,
  deleteFlashSale,
  toggleFlashSaleStatus,
} from "@/libs/flashSale";

export const getFlashSaleAction = async (
  page: number,
  limit: number,
  search: string,
) => {
  const data = await getFlashSale(page, limit, search);
  return data;
};

export const createFlashSaleAction = async (
  flashSale: CreateFlashSaleRequest,
) => {
  const data = await createFlashSale(flashSale);
  return data;
};

export const getFlashSaleByIdAction = async (id: string) => {
  const data = await getFlashSaleById(id);
  return data;
};

export const updateFlashSaleAction = async (
  id: string,
  flashSale: CreateFlashSaleRequest,
) => {
  const data = await updateFlashSale(id, flashSale);
  return data;
};

export const deleteFlashSaleAction = async (id: string) => {
  const data = await deleteFlashSale(id);
  return data;
};

export const toggleFlashSaleStatusAction = async (
  id: string,
  status: string,
) => {
  const data = await toggleFlashSaleStatus(id, status);
  return data;
};
