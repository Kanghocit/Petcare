import { fetchData } from "@/utils/fetchData";
import { Product } from "@/interface/Products";

//get
export const getAllProducts = async (page: string) => {
  const data = await fetchData(`/product?page=${page}`);
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