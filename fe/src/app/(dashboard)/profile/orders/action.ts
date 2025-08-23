"use server";

import { getOrderById, getOrderByUserId } from "@/libs/order";

export const getOrderByUserIdAction = async (id: string) => {
  const response = await getOrderByUserId(id);
  const data = await response.json();
  return data;
};

export const getOrderByIdAction = async (id: string) => {
  const response = await getOrderById(id);
  return response;
};
