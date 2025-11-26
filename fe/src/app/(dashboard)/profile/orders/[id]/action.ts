"use server";

import { cancelOrder, requestReturnOrder } from "@/libs/order";

export const cancelOrderAction = async (id: string, reason: string) => {
  const response = await cancelOrder(id, reason);
  const data = await response.json();
  return data;
};

export const requestReturnOrderAction = async (id: string, reason: string) => {
  const response = await requestReturnOrder(id, reason);
  const data = await response.json();
  return data;
};
