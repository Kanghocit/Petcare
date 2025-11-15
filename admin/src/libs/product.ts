import { fetchData } from "@/utils/fetchData";
import { Product } from "@/interface/Products";

//get
export const getAllProducts = async (
  page: number,
  search: string = "",
  filter?: string,
) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  if (filter) {
    params.set("filter", filter);
  }
  const url = `/product?${params.toString()}`;
  
  
  const data = await fetchData(url);
  return data;
};
export const getProductBySlug = async (slug: string) => {
  const data = await fetchData(`/product/${slug}`);
  return data;
};

//post
export const createProduct = async (dataProduct: Product) => {
  const data = await fetchData(`/product/create`, "POST", dataProduct);
  return data;
};
//put
export const updateProduct = async (slug: string, dataProduct: Product) => {
  const data = await fetchData(`/product/${slug}`, "PUT", dataProduct);
  return data;
};
//delete
export const deleteProduct = async (slug: string) => {
  const data = await fetchData(`/product/${slug}`, "DELETE");
  return data;
};
