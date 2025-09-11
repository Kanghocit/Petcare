"use server";

import { getAllAddress } from "@/libs/address";

export const getAllAddressAction = async (page: number, limit: number) => {
  const data = await getAllAddress(page, limit);
  return data;
};
