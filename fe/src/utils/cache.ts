import { unstable_cache } from "next/cache";

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  // Short cache for frequently changing data
  SHORT: {
    revalidate: 60, // 1 minute
    tags: [] as string[],
  },
  // Medium cache for moderately changing data
  MEDIUM: {
    revalidate: 300, // 5 minutes
    tags: [] as string[],
  },
  // Long cache for rarely changing data
  LONG: {
    revalidate: 3600, // 1 hour
    tags: [] as string[],
  },
  // Very long cache for static data
  STATIC: {
    revalidate: 86400, // 24 hours
    tags: [] as string[],
  },
} as const;

/**
 * Create a cached function with Next.js unstable_cache
 * @param fn - Function to cache
 * @param keyParts - Parts to build cache key
 * @param config - Cache configuration
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  config: typeof CACHE_CONFIG.SHORT | typeof CACHE_CONFIG.MEDIUM | typeof CACHE_CONFIG.LONG | typeof CACHE_CONFIG.STATIC
): T {
  return unstable_cache(
    fn,
    keyParts,
    config
  ) as T;
}

/**
 * Cache tags for invalidation
 */
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT: "product",
  BRANDS: "brands",
  BRAND: "brand",
  NEWS: "news",
  NEW: "new",
  CATEGORIES: "categories",
  CATEGORY: "category",
  ADDRESSES: "addresses",
  ORDERS: "orders",
  FLASH_SALES: "flash_sales",
} as const;

