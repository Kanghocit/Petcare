export type OrderItemInput = {
  product: string;
  quantity: number;
  priceAtPurchase?: number;
};

export type ShippingAddressInput = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
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
    method?: "cod" | "vnpay" | "stripe" | "paypal" | "momo";
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

export async function createOrderClient(payload: CreateOrderPayload) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
  const res = await fetch(`${base}/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Order create failed (${res.status})`);
  }
  return data;
}

