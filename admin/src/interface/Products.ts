export interface Product {
  slug: string;
  title: string;
  description: string;
  price: number; // Giá bán (selling price)
  importPrice?: number; // Giá nhập (import/cost price) - 75% của giá bán
  discount: number;
  status: string;
  quantity: number;
  isNewProduct: boolean;
  isSaleProduct: boolean;
  star: number;
  brand: string;
  category: string;
  images: string[];
  flashSalePrice: number;
}
