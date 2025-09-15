"use client";

import { User } from "@/interface/user";
import { App, Avatar, Button, Input, Rate } from "antd";
import React, { useState, useEffect } from "react";
import { getSocket } from "@/libs/socket";
import { Comment, CommentDisplay, ReplyDisplay } from "@/interface/comment";
import {
  createCommentAtion,
  getCommentAction,
  createReplyCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "./action";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

type RatingValue = "all" | 1 | 2 | 3 | 4 | 5;

const ratingOptions: { label: string; value: RatingValue }[] = [
  { label: "Tất cả", value: "all" },
  { label: "5 Điểm", value: 5 },
  { label: "4 Điểm", value: 4 },
  { label: "3 Điểm", value: 3 },
  { label: "2 Điểm", value: 2 },
  { label: "1 Điểm", value: 1 },
];

const Feedback = ({
  user,
  productSlug,
  comment,
}: {
  user: { user: User };
  productSlug: string;
  comment: CommentDisplay[];
}) => {
  const [selectedRating, setSelectedRating] = useState<RatingValue>("all");
  const [comments, setComments] = useState<CommentDisplay[]>(comment);

  // Tính avgRating ban đầu từ props
  const calculateInitialAvgRating = (comments: CommentDisplay[]) => {
    if (comments.length === 0) return 0;
    const parentComments = comments.filter((comment) => comment.rating > 0);
    if (parentComments.length === 0) return 0;
    const totalRating = parentComments.reduce((sum, c) => sum + c.rating, 0);
    return Math.round((totalRating / parentComments.length) * 10) / 10;
  };

  const [avgRating, setAvgRating] = useState(
    calculateInitialAvgRating(comment)
  );

  // Tính avgRating khi comments thay đổi
  useEffect(() => {
    if (comments.length === 0) {
      setAvgRating(0);
      return;
    }

    // Chỉ tính rating cho comments gốc (không phải replies)
    const parentComments = comments.filter((comment) => comment.rating > 0);

    if (parentComments.length === 0) {
      setAvgRating(0);
      return;
    }

    const totalRating = parentComments.reduce((sum, c) => sum + c.rating, 0);
    const average = totalRating / parentComments.length;
    const rounded = Math.round(average * 10) / 10;

    setAvgRating(rounded);
  }, [comments]);

  const [newComment, setNewComment] = useState({
    name: user ? user.user.name : "",
    rating: 5,
    comment: "",
  });

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const { message, modal } = App.useApp();

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getCommentAction(productSlug);
        if (data && data.comments) {
          // Transform API data to match CommentDisplay interface
          const transformedComments = data.comments.map(
            (comment: {
              _id: string;
              userId?: { _id: string; name: string };
              rating?: number;
              content: string;
              createdAt: string;
              status: string;
              replies?: Array<{
                _id: string;
                userId?: { _id: string; name: string };
                content: string;
                createdAt: string;
              }>;
            }) => ({
              id: comment._id,
              name: comment.userId?.name || "Anonymous",
              rating: comment.rating || 0,
              verified: true, // You can add verification logic later
              comment: comment.content,
              status: comment.status,
              timestamp: comment.createdAt,
              userId: comment.userId?._id,
              replies:
                comment.replies?.map((reply) => ({
                  id: reply._id,
                  name: reply.userId?.name || "Shop Pet",
                  comment: reply.content,
                  timestamp: reply.createdAt,
                })) || [],
            })
          );
          setComments(transformedComments);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };
    loadComments();
  }, [productSlug]);

  // Realtime: listen to new-comment and new-reply
  useEffect(() => {
    const socket = getSocket();

    type NewCommentPayload = {
      productSlug: string;
      comment: {
        _id: string;
        userId?: { _id: string; name: string };
        rating?: number;
        content: string;
        createdAt: string;
        status: string;
      };
    };

    const handleNewComment = (payload: NewCommentPayload) => {
      if (payload?.productSlug !== productSlug) return;
      const c = payload.comment;
      setComments((prev) => [
        {
          id: c._id,
          name: c.userId?.name || "Anonymous",
          rating: c.rating || 0,
          verified: true,
          comment: c.content,
          status: c.status || "active",
          timestamp: c.createdAt,
          userId: c.userId?._id,
          replies: [],
        },
        ...prev,
      ]);
    };

    type NewReplyPayload = {
      productSlug: string;
      reply: {
        _id: string;
        parentId: string;
        userId?: { _id: string; name: string };
        content: string;
        createdAt: string;
        status: string;
      };
    };

    const handleNewReply = (payload: NewReplyPayload) => {
      if (payload?.productSlug !== productSlug) return;
      const r = payload.reply;
      setComments((prev) =>
        prev.map((cm) =>
          cm.id === r.parentId
            ? {
                ...cm,
                replies: [
                  ...cm.replies,
                  {
                    id: r._id,
                    name: r.userId?.name || "Shop Pet",
                    comment: r.content,
                    timestamp: r.createdAt,
                    status: r.status || "active",
                  },
                ],
              }
            : cm
        )
      );
    };

    socket.on("new-comment", handleNewComment);
    socket.on("new-reply", handleNewReply);

    return () => {
      socket.off("new-comment", handleNewComment);
      socket.off("new-reply", handleNewReply);
    };
  }, [productSlug]);

  const filteredComments = comments
    .filter((comment: CommentDisplay) => {
      if (selectedRating === "all") return true;
      return comment.rating === selectedRating;
    })
    .filter((comment: CommentDisplay) => {
      return comment.status === "active";
    });

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.user?._id) {
      message.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    setLoading(true);
    try {
      const commentData: Comment = {
        productSlug,
        userId: user.user._id,
        content: newComment.comment,
        rating: newComment.rating.toString(),
        parentId: null,
        status: "active",
      };

      const result = await createCommentAtion(productSlug, commentData);

      if (result.ok === false) {
        message.error(result.message);
        return;
      }

      message.success("Đã đánh giá thành công");
      setNewComment({ name: "", rating: 5, comment: "" });
      setOpen(false);

      // Reload comments
      const data = await getCommentAction(productSlug);
      if (data && data.comments) {
        const transformedComments = data.comments.map(
          (comment: {
            _id: string;
            userId?: { _id: string; name: string };
            rating?: number;
            content: string;
            createdAt: string;
            status: string;
            replies?: Array<{
              _id: string;
              userId?: { _id: string; name: string };
              content: string;
              createdAt: string;
            }>;
          }) => ({
            id: comment._id,
            name: comment.userId?.name || "Default user",
            rating: comment.rating || 0,
            verified: true,
            comment: comment.content,
            timestamp: comment.createdAt,
            userId: comment.userId?._id,
            status: comment.status,
            replies:
              comment.replies?.map((reply) => ({
                id: reply._id,
                name: reply.userId?.name || "Shop Pet",
                comment: reply.content,
                timestamp: reply.createdAt,
              })) || [],
          })
        );
        setComments(transformedComments);
      }
    } catch {
      message.error(`Có lỗi xảy ra khi gửi đánh giá`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    if (!user?.user?._id) {
      message.error("Vui lòng đăng nhập để trả lời bình luận");
      return;
    }

    setLoading(true);
    try {
      const replyData: Comment = {
        productSlug,
        userId: user.user._id,
        content: replyText,
        rating: "0", // Reply không cần rating
        parentId: commentId,
        status: "active",
      };

      const result = await createReplyCommentAction(
        productSlug,
        commentId,
        replyData
      );

      if (!result.comment) {
        message.error(result.message);
        return;
      }

      message.success("Đã trả lời thành công");
      setReplyText("");
      setReplyTo(null);

      // Reload comments
      const data = await getCommentAction(productSlug);
      if (data && data.comments) {
        const transformedComments = data.comments.map(
          (comment: {
            _id: string;
            userId?: { _id: string; name: string };
            rating?: number;
            content: string;
            createdAt: string;
            status: string;
            replies?: Array<{
              _id: string;
              userId?: { _id: string; name: string };
              content: string;
              createdAt: string;
            }>;
          }) => ({
            id: comment._id,
            name: comment.userId?.name || "Default user",
            rating: comment.rating || 0,
            verified: true,
            comment: comment.content,
            timestamp: comment.createdAt,
            userId: comment.userId?._id,
            status: comment.status,
            replies:
              comment.replies?.map((reply) => ({
                id: reply._id,
                name: reply.userId?.name || "Shop Pet",
                comment: reply.content,
                timestamp: reply.createdAt,
              })) || [],
          })
        );
        setComments(transformedComments);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      message.error("Có lỗi xảy ra khi gửi trả lời");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (
    commentId: string,
    currentText: string,
    currentRating: number
  ) => {
    setEditingComment(commentId);
    setEditText(currentText);
    setEditRating(currentRating);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;
    if (!user?.user?._id) {
      message.error("Vui lòng đăng nhập để chỉnh sửa bình luận");
      return;
    }

    setLoading(true);
    try {
      const result = await updateCommentAction(
        commentId,
        editText,
        user.user._id,
        editRating
      );
      if (result.ok) {
        message.success("Đã cập nhật bình luận thành công");
        setEditingComment(null);
        setEditText("");
        setEditRating(5);

        // Reload comments
        const data = await getCommentAction(productSlug);
        if (data && data.comments) {
          const transformedComments = data.comments.map(
            (comment: {
              _id: string;
              userId?: { _id: string; name: string };
              rating?: number;
              content: string;
              createdAt: string;
              status: string;
              replies?: Array<{
                _id: string;
                userId?: { _id: string; name: string };
                content: string;
                createdAt: string;
              }>;
            }) => ({
              id: comment._id,
              name: comment.userId?.name || "Default user",
              rating: comment.rating || 0,
              verified: true,
              comment: comment.content,
              timestamp: comment.createdAt,
              userId: comment.userId?._id,
              status: comment.status,
              replies:
                comment.replies?.map((reply) => ({
                  id: reply._id,
                  name: reply.userId?.name || "Shop Pet",
                  comment: reply.content,
                  timestamp: reply.createdAt,
                })) || [],
            })
          );
          setComments(transformedComments);
        }
      } else {
        message.error("Không thể cập nhật bình luận");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      message.error("Có lỗi xảy ra khi cập nhật bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user?.user?._id) {
      message.error("Vui lòng đăng nhập để xóa bình luận");
      return;
    }

    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const result = await deleteCommentAction(commentId, user.user._id);
          if (result.ok) {
            message.success("Đã xóa bình luận thành công");

            // Cập nhật state trực tiếp thay vì reload
            setComments((prevComments) => {
              const updatedComments = prevComments.filter(
                (comment) => comment.id !== commentId
              );

              return updatedComments;
            });
          } else {
            message.error("Không thể xóa bình luận");
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          message.error("Có lỗi xảy ra khi xóa bình luận");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-bold mb-2">
        Đánh giá nhận xét từ khách hàng
      </h2>
      <div className="bg-blue-50 border border-gray-200 rounded p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Khối điểm trung bình và sao */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-3xl font-semibold text-blue-700">
            {avgRating}/5
          </div>
          <Rate disabled value={avgRating} />
          <div className="text-sm text-gray-600">
            ({comments.filter((comment) => comment.rating > 0).length} đánh giá)
          </div>
        </div>

        {/* Bộ lọc sao */}
        <div className="flex flex-wrap gap-2 justify-center">
          {ratingOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRating(option.value)}
              className={`px-4 py-2 border rounded text-sm ${
                selectedRating === option.value
                  ? "bg-white border-blue-500 text-blue-600 font-medium"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option.label} {option.value === "all" ? "" : `(${option.value})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6 border-b-1 border-gray-300">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setOpen(!open)}
          className="mb-2"
        >
          Viết đánh giá
        </Button>
      </div>
      {/* Form thêm bình luận mới */}
      <div
        className={`rounded-lg transition-all duration-300 ease-in-out transform ${
          open
            ? "opacity-100 scale-100 max-h-screen mt- p-4"
            : "opacity-0 scale-95 max-h-0 overflow-hidden"
        }`}
      >
        <form
          onSubmit={handleAddComment}
          className="px-4 pb-4 pt-2 shadow shadow-blue-300 rounded-lg"
        >
          <h3 className="font-semibold my-4">Thêm đánh giá của bạn</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên của bạn
              </label>
              <Input
                type="text"
                defaultValue={newComment.name}
                onChange={(e) =>
                  setNewComment({ ...newComment, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xếp hạng
              </label>
              <Rate
                value={newComment.rating}
                onChange={(value) =>
                  setNewComment({
                    ...newComment,
                    rating: value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhận xét
              </label>
              <TextArea
                value={newComment.comment}
                onChange={(e) =>
                  setNewComment({ ...newComment, comment: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                htmlType="submit"
                color="primary"
                variant="filled"
                loading={loading}
                disabled={loading}
              >
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Danh sách bình luận */}
      <div className="mt-6">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment: CommentDisplay) => (
            <div
              key={comment.id}
              className="mb-6 border-b-1 border-gray-300 pb-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Avatar
                    style={{
                      backgroundColor: "green",
                      verticalAlign: "middle",
                    }}
                    size="large"
                    gap={2}
                  >
                    {user.user.name.split("")[0].toUpperCase()}
                  </Avatar>
                  <span className="font-semibold">{comment.name}</span>
                  <Rate
                    disabled
                    value={comment.rating}
                    style={{ fontSize: 12, alignItems: "center" }}
                  />
                  {comment.verified ? (
                    <CheckCircleOutlined className="text-green-600!" />
                  ) : (
                    <CloseCircleOutlined className="text-red-600!" />
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-gray-700">
                {editingComment === comment.id ? (
                  <div className="flex-1">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xếp hạng
                      </label>
                      <Rate
                        value={editRating}
                        onChange={(value) => setEditRating(value)}
                      />
                    </div>
                    <TextArea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={loading}
                        loading={loading}
                        type="primary"
                        size="small"
                      >
                        Cập nhật
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingComment(null);
                          setEditText("");
                          setEditRating(5);
                        }}
                        disabled={loading}
                        size="small"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{comment.comment}</p>
                    {user?.user?._id && comment.userId === user.user._id && (
                      <div className="flex">
                        <Button
                          icon={<EditOutlined />}
                          color="primary"
                          variant="text"
                          onClick={() =>
                            handleEditComment(
                              comment.id,
                              comment.comment,
                              comment.rating
                            )
                          }
                          disabled={loading}
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          color="danger"
                          variant="text"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={loading}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Phần trả lời */}
              {comment.replies.length > 0 && comment.status === "active" && (
                <div className="ml-8 mt-4 space-y-4">
                  {comment.replies.map((reply: ReplyDisplay) => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">
                          {reply.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(reply.timestamp)}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-700">{reply.comment}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form trả lời */}
              {replyTo === comment.id ? (
                <div className="ml-8 mt-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Nhập phản hồi của bạn..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {loading ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                    <button
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText("");
                      }}
                      disabled={loading}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Trả lời
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
