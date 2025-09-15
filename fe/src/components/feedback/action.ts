"use server";

import { Comment, UpdateCommentData } from "@/interface/comment";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/libs/comment";

export const createCommentAtion = async (
  productSlug: string,
  comment: Comment
) => {
  const data = await createComment(productSlug, comment);
  return data;
};

export const getCommentAction = async (productSlug: string) => {
  const data = await getComments(productSlug);
  return data;
};

export const createReplyCommentAction = async (
  productSlug: string,
  parentId: string,
  comment: Comment
) => {
  const replyData = {
    ...comment,
    parentId: parentId,
  };
  const data = await createComment(productSlug, replyData);
  return data;
};

export const updateCommentAction = async (
  commentId: string,
  content: string,
  userId: string,
  rating?: number
) => {
  const updateData: UpdateCommentData = { id: commentId, content, userId };
  if (rating !== undefined) updateData.rating = rating;
  const data = await updateComment(updateData as unknown as Comment);
  return data;
};

export const deleteCommentAction = async (
  commentId: string,
  userId: string
) => {
  const data = await deleteComment({ id: commentId, userId });
  return data;
};
