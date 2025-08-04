import { fetchWithToken } from "@/utils/fetchWithToken";

export const getNews = async (page: number, limit: number) => {
  const response = await fetchWithToken(`/news?page=${page}&limit=${limit}&status=active`);
  const data = await response.json();
  return data;
};

export const getNewsBySlug = async (slug: string) => {
  const response = await fetchWithToken(`/news/${slug}`);
  const data = await response.json();
  return data;
};