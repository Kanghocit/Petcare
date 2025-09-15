"use server";

import {
  deleteComment,
  getCommentsInAdmin,
  replyComment,
  updateComment,
  updateCommentStatus,
} from "@/libs/comment";

export const getCommentsInAdminAction = async (page: number, limit: number) => {
  const data = await getCommentsInAdmin(page, limit);
  return data;
};

export const deleteCommentAction = async (id: string) => {
  const data = await deleteComment(id);
  return data;
};

export const replyCommentAction = async (parentId: string, content: string) => {
  const data = await replyComment(parentId, content);
  return data;
};

export const updateCommentStatusAction = async (id: string, status: string) => {
  const data = await updateCommentStatus(id, status);
  return data;
};

export const updateCommentAction = async (
  id: string,
  content: string,
  rating?: number,
  userId?: string,
) => {
  const data = await updateComment(id, content, rating, userId);
  return data;
};
