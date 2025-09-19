import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getProducts = async (
  page: number,
  search: string,
  limit: number,
  extraQuery: string = ""
) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeSearch = search ? encodeURIComponent(search) : "";
  const extras = extraQuery ? `&${extraQuery}` : "";
  const data = await fetchWithoutToken(
    `/product?page=${safePage}&search=${safeSearch}&limit=${limit}${extras}`,
    "GET"
  );
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const data = await fetchWithoutToken(`/product/${slug}`, "GET");
  return data;
};

export const searchProduct = async (
  search: string,
  page: number,
  limit: number
) => {
  const data = await fetchWithoutToken(
    `/product/search?q=${encodeURIComponent(
      search
    )}&page=${page}&limit=${limit}`
  );
  return data;
};
