"use server";

import { getNews } from "@/libs/new";

export const getNewsAction = async (page: number, limit: number) => {
  const data = getNews(page, limit);
  return data;
};
