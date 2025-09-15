import { fetchData } from "@/utils/fetchData";

export const getCommentsInAdmin = async (page: number, limit: number) => {
  const data = await fetchData(`/comment/admin?page=${page}&limit=${limit}`);
  return data;
};

export const updateComment = async (
  id: string,
  content: string,
  rating?: number,
  userId?: string,
) => {
  const body: Record<string, unknown> = { id, content };
  if (typeof rating !== "undefined") body.rating = rating;
  if (typeof userId !== "undefined") body.userId = userId;
  const response = await fetchData(`/comment`, "PUT", body);
  return response;
};

export const deleteComment = async (id: string) => {
  const response = await fetchData(`/comment`, "DELETE", { id });
  return response;
};

export const replyComment = async (parentId: string, content: string) => {
  const response = await fetchData(`/comment/reply`, "POST", {
    parentId,
    content,
  });
  return response;
};

export const updateCommentStatus = async (id: string, status: string) => {
  const response = await fetchData(`/comment/status`, "PATCH", {
    id,
    status,
  });
  return response;
};
