import { fetchData } from "@/utils/fetchData";
import type { FulfillmentInfo, PaymentInfo } from "@/interface/Orders";

export const getOrders = async (
  page: number,
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
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (filters?.search) params.set("search", filters.search);
  if (filters?.orderCode) params.set("orderCode", filters.orderCode);
  if (filters?.fullName) params.set("fullName", filters.fullName);
  if (filters?.paymentMethod)
    params.set("paymentMethod", filters.paymentMethod);
  if (filters?.paymentStatus)
    params.set("paymentStatus", filters.paymentStatus);
  if (filters?.fulfillmentStatus)
    params.set("fulfillmentStatus", filters.fulfillmentStatus);
  if (filters?.status) params.set("status", filters.status);

  const query = params.toString();
  const data = await fetchData(`/orders?${query}`);
  return data;
};

export const getOrderById = async (id: string) => {
  const data = await fetchData(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (
  id: string,
  payload: {
    fulfillmentStatus?: FulfillmentInfo["status"];
    paymentStatus?: PaymentInfo["status"];
    note?: string;
  },
) => {
  const data = await fetchData(`/orders/${id}/status`, "PATCH", payload);
  return data;
};
