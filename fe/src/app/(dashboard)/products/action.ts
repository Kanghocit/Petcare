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
  try {
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
  } catch (error) {
    // Xử lý lỗi một cách thân thiện
    const errorMessage =
      error instanceof Error ? error.message : "Không tìm được sản phẩm";
    return {
      ok: true,
      message: errorMessage.includes("Không tìm thấy")
        ? errorMessage
        : search
        ? `Không tìm thấy sản phẩm nào với từ khóa "${search}"`
        : "Không có sản phẩm nào",
      products: [],
      total: 0,
      page: page || 1,
      limit: limit || 10,
      totalPages: 0,
    };
  }
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
  try {
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
  } catch (error) {
    // Xử lý lỗi một cách thân thiện
    const errorMessage =
      error instanceof Error ? error.message : "Không tìm được sản phẩm";
    return {
      ok: true,
      message: errorMessage.includes("Không tìm thấy")
        ? errorMessage
        : `Không tìm thấy sản phẩm nào với từ khóa "${q}"`,
      products: [],
      total: 0,
      page,
      totalPages: 0,
      query: q,
    };
  }
};
