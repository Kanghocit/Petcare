import { fetchWithoutToken } from "@/utils/fetchWithoutToken";
import { fetchWithToken } from "@/utils/fetchWithToken";

export type OrderItemInput = {
  product: string;
  quantity: number;
  priceAtPurchase?: number;
  image?: string;
  name?: string;
};

export type ShippingAddressInput = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  zipCode?: string;
};

export type CreateOrderPayload = {
  items: OrderItemInput[];
  shippingAddress: ShippingAddressInput;
  shipping?: {
    method?: "standard" | "express" | "same_day";
    fee?: number;
    estimatedDays?: number;
    notes?: string;
  };
  discount?: {
    amount?: number;
    code?: string;
    type?: "percentage" | "fixed";
    description?: string;
  };
  payment?: {
    method?: "cod" | "ck" | "momo";
    status?:
      | "unpaid"
      | "authorized"
      | "paid"
      | "partially_refunded"
      | "refunded"
      | "failed"
      | "voided"
      | "chargeback";
  };
  note?: string;
  source?: string;
};

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetchWithToken(`/orders/create`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
}
export const getOrderByUserId = async (id: string) => {
  const data = await fetchWithToken(`/orders/${id}/orders`);
  return data;
};

export const getOrderById = async (id: string) => {
  const data = await fetchWithoutToken(`/orders/${id}`, "GET");
  return data;
};

export const cancelOrder = async (id: string, reason: string) => {
  const data = await fetchWithToken(`/orders/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  return data;
};
