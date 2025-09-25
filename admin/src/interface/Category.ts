export interface Category {
  _id?: string;
  name: string;
  level?: number;
  parentId?: string | null;
  isActive?: boolean;
  productCount?: number;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}
