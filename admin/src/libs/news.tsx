import { fetchData } from "@/utils/fetchData";

export const getAllNews = async () => {
  const data = await fetchData(`/news`);
  return data;   
};

export const getNewsByStatus = async (status: string) => {
  const data = await fetchData(`/news/status?status=${status}`);
  return data;
};

export const deleteNews = async (slug: string) => {
  const data = await fetchData(`/news/${slug}`, "DELETE");
  return data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const approveNews = async (slug: string , newData: any) => {
  const data = await fetchData(`/news/${slug}`, "PUT", newData);
  return data;
};

export const getNewsBySlug = async (slug: string) => {
  const data = await fetchData(`/news/${slug}`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateNews = async (slug: string, newData: any) => {
  const data = await fetchData(`/news/${slug}`, "PUT", newData);
  return data;
};