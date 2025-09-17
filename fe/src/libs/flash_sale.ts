import { fetchWithoutToken } from "@/utils/fetchWithoutToken";
import type { FlashSaleListResponse } from "@/interface/flashSale";

export const getFlashSale = async (): Promise<FlashSaleListResponse> => {
  const data = await fetchWithoutToken("/flash-sale");
  return data as FlashSaleListResponse;
};
