'use server'

import { deleteNews, getAllNews, getNewsByStatus, approveNews, getNewsBySlug, updateNews } from "./libs/news";

export const getAllNewsAction = async (page: number) => {
  const data = await getAllNews(page);
  return data;
};

export const getNewsByStatusAction = async (status: string) => {
  const data = await getNewsByStatus(status);
  return data;
};

export const deleteNewsAction = async (slug: string) => {
  return deleteNews(slug);
};

export const approveNewsAction = async (slug: string, status: string) => {
  return approveNews(slug, { status });
};

export const getNewsBySlugAction = async (slug: string) => {
  return getNewsBySlug(slug);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateNewsAction = async (slug: string, data: any) => {
  return updateNews(slug, data);
};