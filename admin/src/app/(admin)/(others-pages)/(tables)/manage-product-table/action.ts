"use server";

import { Product } from "@/interface/Products";
import { createProduct, getAllProducts, getProductBySlug, updateProduct } from "@/libs/product";

export const getAllProductsAction = async (page: number, search: number) => {
  const data = await getAllProducts(page, search);
  return data;
};

export const CreateProductAction = async (newProduct: Product) => {
  const data = await createProduct(newProduct);
  return data;
};
export const UpdateProductAction = async (
  slug: string,
  newProduct: Product,
) => {
  const data = await updateProduct(slug, newProduct);
  return data;
};

export const getProductBySlugAction = async (slug: string) => {
  const data = await getProductBySlug(slug);
  return data;
};