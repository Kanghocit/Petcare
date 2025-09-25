import { Category } from "@/interface/Category";
import { fetchData } from "@/utils/fetchData";

export const getCategory = async () => {
  const data = await fetchData("/category");
  return data;
};

export const createCategory = async (category: Category) => {
  const data = await fetchData("/category", "POST", category);
  return data;
};

export const updateCategory = async (
  slug: string,
  updatedCategory: Category,
) => {
  const data = await fetchData(`/category/${slug}`, "PUT", updatedCategory);
  return data;
};

export const deleteCategory = async (slug: string) => {
  const data = await fetchData(`/category/${slug}`, "DELETE");
  return data;
};
