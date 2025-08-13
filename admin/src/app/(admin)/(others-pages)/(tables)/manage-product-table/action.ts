"use server";

import { Product } from "@/interface/Products";
import { createProduct, getAllProducts, updateProduct } from "@/libs/product";

export const getAllProductsAction = async (page: string) => {
  const data = await getAllProducts(page);
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
