"use server";

import { fetchWithToken } from "@/utils/fetchWithToken";
import { getFlashSale } from "./libs/flash_sale";
import type { FlashSale } from "@/interface/flashSale";

export const getUser = async () => {
  try {
    const user = await fetchWithToken("/user/profile");
    if (!user.ok) {
      return { user: null };
    }
    const userData = await user.json();
    return userData;
  } catch (error) {
    // Nếu có lỗi (không có token, network error, etc), trả về null user
    return { user: null };
  }
};

export const getFlashSaleAction = async (): Promise<FlashSale | null> => {
  const list = await getFlashSale();
  const first = list.flashSales?.[0] ?? null;
  return first;
};
