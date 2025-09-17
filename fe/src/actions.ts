"use server";

import { fetchWithToken } from "@/utils/fetchWithToken";
import { getFlashSale } from "./libs/flash_sale";
import type { FlashSale } from "@/interface/flashSale";

export const getUser = async () => {
  const user = await fetchWithToken("/user/profile");
  const userData = await user.json();
  return userData;
};

export const getFlashSaleAction = async (): Promise<FlashSale | null> => {
  const list = await getFlashSale();
  const first = list.flashSales?.[0] ?? null;
  return first;
};
