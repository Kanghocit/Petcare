"use server";

import { getAllBrands } from "@/libs/brand";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/utils/cache";

// Cache brands for 1 hour (rarely changes)
export const getAllBrandsActions = async (page: number, limit: number) => {
  const cachedGetBrands = unstable_cache(
    async () => {
      return await getAllBrands(page, limit);
    },
    [`brands-component-${page}-${limit}`],
    {
      revalidate: 3600, // 1 hour
      tags: [CACHE_TAGS.BRANDS],
    }
  );
  
  return await cachedGetBrands();
};
