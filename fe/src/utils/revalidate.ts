import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "./cache";

/**
 * Revalidate cache by tag
 */
export async function revalidateByTag(tag: string) {
  revalidateTag(tag);
}

/**
 * Revalidate cache by path
 */
export async function revalidateByPath(path: string) {
  revalidatePath(path);
}

/**
 * Revalidate product cache
 */
export async function revalidateProduct(slug?: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS);
  if (slug) {
    revalidateTag(`${CACHE_TAGS.PRODUCT}-${slug}`);
  }
  revalidateTag(CACHE_TAGS.PRODUCT);
  revalidatePath("/products");
  if (slug) {
    revalidatePath(`/product/${slug}`);
  }
}

/**
 * Revalidate brand cache
 */
export async function revalidateBrand() {
  revalidateTag(CACHE_TAGS.BRANDS);
  revalidatePath("/brands");
}

/**
 * Revalidate news cache
 */
export async function revalidateNews(slug?: string) {
  revalidateTag(CACHE_TAGS.NEWS);
  if (slug) {
    revalidateTag(`${CACHE_TAGS.NEW}-${slug}`);
  }
  revalidatePath("/news");
  if (slug) {
    revalidatePath(`/news/${slug}`);
  }
}

