"use server";

import { getNews } from "@/libs/new";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/utils/cache";

// Cache news for 5 minutes
export const getNewsAction = async (page: number, limit: number) => {
  const cachedGetNews = unstable_cache(
    async () => {
      return await getNews(page, limit);
    },
    [`news-${page}-${limit}`],
    {
      revalidate: 300, // 5 minutes
      tags: [CACHE_TAGS.NEWS],
    }
  );
  
  return await cachedGetNews();
};
