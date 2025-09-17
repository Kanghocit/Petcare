export interface FlashSaleProductItem {
  productId: {
    _id: string;
    slug: string;
    title: string;
    star: number;
    price: number;
    discount: number;
    isNewProduct: boolean;
    isSaleProduct: boolean;
    images: string[];
  };
  flashSalePrice: number;
  quantity: number;
  sold: number;
}

export interface FlashSale {
  _id: string;
  name: string;
  products: FlashSaleProductItem[];
  startDate: string;
  endDate: string;
  discountType: "fixed" | "percent";
  status: "active" | "inactive";
}

export interface FlashSaleListResponse {
  ok: boolean;
  flashSales: FlashSale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
