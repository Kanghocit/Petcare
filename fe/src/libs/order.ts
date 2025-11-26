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
  // Always fetch fresh orders list for the current user (no stale cache)
  const data = await fetchWithToken(
    `/orders/${id}/orders`,
    {},
    { next: { revalidate: 0 } }
  );
  return data;
};

export const getOrderById = async (id: string) => {
  // Always fetch the latest order detail (no cache), so status reflects admin changes
  const data = await fetchWithoutToken(`/orders/${id}`, "GET", null, {
    next: { revalidate: 0 },
  });
  return data;
};

export const cancelOrder = async (id: string, reason: string) => {
  const data = await fetchWithToken(`/orders/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  return data;
};

// User request to return order after it has been delivered
// -> only attach note; admin will later change fulfillmentStatus to "returned"
export const requestReturnOrder = async (id: string, reason: string) => {
  const data = await fetchWithToken(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      // Prefix to help admin UI detect that this note comes from a return request
      note: `[RETURN_REQUEST] ${reason}`,
    }),
  });
  return data;
};
