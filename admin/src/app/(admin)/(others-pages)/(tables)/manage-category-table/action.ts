"use server";

import { Category } from "@/interface/Category";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/libs/category";

export const getCategoryAction = async () => {
  const data = await getCategory();
  return data;
};

export const createCategoryAction = async (category: Category) => {
  const data = await createCategory(category);
  return data;
};

export const updateCategoryAction = async (
  slug: string,
  updatedCategory: Category,
) => {
  const data = await updateCategory(slug, updatedCategory);
  return data;
};

export const deleteCategoryAction = async (slug: string) => {
  const data = await deleteCategory(slug);
  return data;
};
