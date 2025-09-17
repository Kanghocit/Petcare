import { Product } from "./Products";

export interface FlashSaleResponse {
  flashSale: FlashSale;
  total: number;
}

export interface FlashSale {
  _id?: string;
  name: string;
  products: {
    productId: string | Product; // may be populated from backend
    flashSalePrice: number;
    quantity: number;
    sold?: number;
  }[];
  discountType: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export interface CreateFlashSaleRequest {
  name: string;
  products: {
    productId: string;
    flashSalePrice: number;
    quantity: number;
  }[];
  discountType: string;
  startDate: string;
  endDate: string;
}
