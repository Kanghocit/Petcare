"use server";

import { getProductBySlug, getProducts } from "@/libs/product";

export const getProductsAction = async (
  page: number,
  search: string,
  limit: number,
  extraQuery: string = ""
) => {
  const data = await getProducts(page, search, limit, extraQuery);
  return data;
};
export const getProductBySlugAction = async (slug: string) => {
  const data = await getProductBySlug(slug);
  return data;
};
