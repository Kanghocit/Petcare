"use server";

import { getProductBySlug, getProducts, searchProduct } from "@/libs/product";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/utils/cache";

// Cache products list for 5 minutes
export const getProductsAction = async (
  page?: number | 1,
  search?: string | "",
  limit?: number | 10,
  extraQuery: string = ""
) => {
  const cachedGetProducts = unstable_cache(
    async () => {
      return await getProducts(page, search, limit, extraQuery);
    },
    [`products-${page}-${search}-${limit}-${extraQuery}`],
    {
      revalidate: 300, // 5 minutes
      tags: [CACHE_TAGS.PRODUCTS],
    }
  );
  
  return await cachedGetProducts();
};

// Cache individual product for 1 hour (rarely changes)
export const getProductBySlugAction = async (slug: string) => {
  const cachedGetProduct = unstable_cache(
    async () => {
      return await getProductBySlug(slug);
    },
    [`product-${slug}`],
    {
      revalidate: 3600, // 1 hour
      tags: [CACHE_TAGS.PRODUCT, `${CACHE_TAGS.PRODUCT}-${slug}`],
    }
  );
  
  return await cachedGetProduct();
};

// Cache search results for 2 minutes (more dynamic)
export const searchProductAction = async (
  q: string,
  page: number,
  limit: number
) => {
  const cachedSearch = unstable_cache(
    async () => {
      return await searchProduct(q, page, limit);
    },
    [`search-${q}-${page}-${limit}`],
    {
      revalidate: 120, // 2 minutes
      tags: [CACHE_TAGS.PRODUCTS],
    }
  );
  
  return await cachedSearch();
};
