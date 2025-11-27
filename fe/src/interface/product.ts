export interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  isNewProduct: boolean;
  isSaleProduct: boolean;
  star: number;
  brand: string;
  images: string[];
  totalReviews?: number;
}
