import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getProducts = async (page: number, search: string) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeSearch = search ? encodeURIComponent(search) : "";
  const data = await fetchWithoutToken(
    `/product?page=${safePage}&search=${safeSearch}`,
    "GET"
  );
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const data = await fetchWithoutToken(`/product/${slug}`, "GET");
  return data;
};
