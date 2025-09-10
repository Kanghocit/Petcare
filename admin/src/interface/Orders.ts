export interface Orders {
  _id: string;
  orderCode: string;
  user: User;
  items: OrderItem[];
  shipping: ShippingInfo;
  shippingAddress: AddressInfo;
  subtotal: number;
  totalAmount: number;
  discount: DiscountInfo;
  payment: PaymentInfo;
  fulfillment: FulfillmentInfo;
  status: "open" | "completed" | "cancelled" | "closed";
  note?: string;
  source: "web" | "mobile" | "admin";
  paymentExpiresAt?: string;
}
export interface User {
  name: string;
  email: string;
  phone: string;
  rank: string;
}

export interface OrderItem {
  _id?: string;
  product: PopulatedProduct;
  quantity: number;
  priceAtPurchase: number;
  productSnapshot: ProductSnapshot;
  fulfillment: ItemFulfillment;
}

export interface PopulatedProduct {
  quantity: number;
  title?: string;
  price?: number;
  images?: string[];
  slug?: string;
  brand?: string;
}

export interface ProductSnapshot {
  title?: string;
  slug?: string;
  image?: string;
  sku?: string;
  brand?: string;
}

export interface ItemFulfillment {
  returnedQty: number;
  reviewed: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingInfo {
  method: "standard" | "express" | "same_day";
  fee: number;
  estimatedDays: number;
  notes: string;
}

export interface AddressInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface DiscountInfo {
  // Discount details
  // This would contain discount information
  [key: string]: string | number | boolean | undefined;
}

export interface PaymentInfo {
  status:
    | "unpaid"
    | "authorized"
    | "paid"
    | "partially_refunded"
    | "refunded"
    | "failed"
    | "voided"
    | "chargeback";
  method: "cod" | "ck" | "momo";
  refundedAmount: number;
  transactions: Transaction[];
  paidAt?: string;
}

export interface Transaction {
  // Transaction details
  // This would contain payment transaction information
  [key: string]: string | number | boolean | undefined;
}

export interface FulfillmentInfo {
  status:
    | "unfulfilled"
    | "processing"
    | "shipping"
    | "shipped"
    | "delivered"
    | "returned"
    | "cancelled";
  note: string;
  source: "web" | "mobile" | "admin";
  shippedAt?: string;
  deliveredAt?: string;
}
