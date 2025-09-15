import { fetchWithoutToken } from "@/utils/fetchWithoutToken";
import { Comment } from "@/interface/comment";

export const createComment = async (productSlug: string, comment: Comment) => {
  const data = await fetchWithoutToken(
    `/comment/${productSlug}`,
    "POST",
    comment
  );
  return data;
};

export const getComments = async (productSlug: string) => {
  const data = await fetchWithoutToken(`/comment/${productSlug}`);
  return data;
};

export const updateComment = async (comment: Comment) => {
  const data = await fetchWithoutToken("/comment", "PUT", comment);
  return data;
};

export const deleteComment = async (data: { id: string; userId: string }) => {
  const result = await fetchWithoutToken("/comment", "DELETE", data);
  return result;
};
