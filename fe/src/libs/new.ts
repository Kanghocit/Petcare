import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

// News không cần token, dùng fetchWithoutToken để có thể cache
export const getNews = async (page: number, limit: number) => {
  const data = await fetchWithoutToken(
    `/news?page=${page}&limit=${limit}&status=active`
  );
  return data;
};

export const getNewsBySlug = async (slug: string) => {
  const data = await fetchWithoutToken(`/news/${slug}`);
  return data;
};
