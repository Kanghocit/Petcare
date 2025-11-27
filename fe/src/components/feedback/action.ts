"use server";

import { revalidatePath } from "next/cache";
import { Comment, UpdateCommentData } from "@/interface/comment";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/libs/comment";

const revalidateProductPages = (slug: string) => {
  if (!slug) return;
  revalidatePath(`/product/${slug}`);
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
};

export const createCommentAtion = async (
  productSlug: string,
  comment: Comment
) => {
  const data = await createComment(productSlug, comment);
  if (data?.ok) {
    revalidateProductPages(productSlug);
  }
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
  if (data?.ok) {
    revalidateProductPages(productSlug);
  }
  return data;
};

export const updateCommentAction = async (
  commentId: string,
  content: string,
  userId: string,
  rating?: number,
  productSlug?: string
) => {
  const updateData: UpdateCommentData = { id: commentId, content, userId };
  if (rating !== undefined) updateData.rating = rating;
  const data = await updateComment(updateData as unknown as Comment);
  if (data?.ok && productSlug) {
    revalidateProductPages(productSlug);
  }
  return data;
};

export const deleteCommentAction = async (
  commentId: string,
  userId: string,
  productSlug?: string
) => {
  const data = await deleteComment({ id: commentId, userId });
  if (data?.ok && productSlug) {
    revalidateProductPages(productSlug);
  }
  return data;
};
