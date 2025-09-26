export interface Product {
  slug: string;
  title: string;
  description: string;
  price: number;
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
