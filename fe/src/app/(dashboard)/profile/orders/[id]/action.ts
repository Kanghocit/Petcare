"use server";

import { cancelOrder } from "@/libs/order";

export const cancelOrderAction = async (id: string, reason: string) => {
  const response = await cancelOrder(id, reason);
  const data = await response.json();
  return data;
};
