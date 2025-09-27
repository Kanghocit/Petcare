"use server";

import { getProductBySlug, getProducts, searchProduct } from "@/libs/product";

export const getProductsAction = async (
  page?: number | 1,
  search?: string | "",
  limit?: number | 10,
  extraQuery: string = ""
) => {
  const data = await getProducts(page, search, limit, extraQuery);
  return data;
};
export const getProductBySlugAction = async (slug: string) => {
  const data = await getProductBySlug(slug);
  return data;
};

export const searchProductAction = async (
  q: string,
  page: number,
  limit: number
) => {
  const data = await searchProduct(q, page, limit);
  return data;
};
