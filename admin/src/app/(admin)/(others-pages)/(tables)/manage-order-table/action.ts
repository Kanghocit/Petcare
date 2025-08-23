"use server";

import type { FulfillmentInfo, PaymentInfo } from "@/interface/Orders";
import { getOrderById, getOrders, updateOrderStatus } from "@/libs/orders";
import { revalidatePath } from "next/cache";

export const getOrdersAction = async (
  page: number = 1,
  filters?: {
    search?: string;
    orderCode?: string;
    fullName?: string;
    paymentMethod?: "cod" | "vnpay" | "momo";
    paymentStatus?: PaymentInfo["status"];
    fulfillmentStatus?: FulfillmentInfo["status"];
    status?: "open" | "completed" | "cancelled" | "closed";
  },
) => {
  const data = await getOrders(page, filters);
  return data;
};

export const getOrderByIdAction = async (id: string) => {
  const data = await getOrderById(id);
  return data;
};

export const updateOrderStatusAction = async (
  id: string,
  payload: {
    fulfillmentStatus?: FulfillmentInfo["status"];
    paymentStatus?: PaymentInfo["status"];
    note?: string;
  },
) => {
  const data = await updateOrderStatus(id, payload);
  revalidatePath(`/admin/manage-order-table/${id}`);
  return data;
};
