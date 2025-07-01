"use client";

import React, { useState } from "react";

interface Reply {
  id: number;
  name: string;
  comment: string;
  timestamp: string;
}

interface Comment {
  id: number;
  name: string;
  rating: number;
  verified: boolean;
  comment: string;
  timestamp: string;
  replies: Reply[];
}

const commentsInit: Comment[] = [
  {
    id: 1,
    name: "Tuan Anh",
    rating: 4,
    verified: true,
    comment:
      "San pham chat luong, meo nha minh an kha hop. Vi ga thom, pate min, de tieu hoa. Minh thay co rau chan vit va taurine la diem cong. Chi hoi kho dat lai vi het hang nhanh. Van se ung ho shop.",
    timestamp: "2024-03-15T10:30:00",
    replies: [
      {
        id: 1,
        name: "Shop Pet",
        comment:
          "Cảm ơn bạn đã ủng hộ shop. Chúng tôi sẽ cố gắng nhập thêm hàng sớm nhất có thể.",
        timestamp: "2024-03-15T11:00:00",
      },
    ],
  },
  {
    id: 2,
    name: "Dang Van Nam",
    rating: 3,
    verified: true,
    comment:
      "Pate nay on, nhung meo minh chi an duoc mot it roi chan. Co le do be khong thich rau chan vit. Thanh phan nhin chung tot, nhieu dinh duong. Minh se thu vi khac xem sao. Goi nho tien loi.",
    timestamp: "2024-03-14T15:45:00",
    replies: [],
  },
];

type RatingValue = "all" | 1 | 2 | 3 | 4 | 5;

const ratingOptions: { label: string; value: RatingValue }[] = [
  { label: "Tất cả", value: "all" },
  { label: "5 Điểm", value: 5 },
  { label: "4 Điểm", value: 4 },
  { label: "3 Điểm", value: 3 },
  { label: "2 Điểm", value: 2 },
  { label: "1 Điểm", value: 1 },
];

const Feedback = () => {
  const [selectedRating, setSelectedRating] = useState<RatingValue>("all");
  const [comments, setComments] = useState<Comment[]>(commentsInit);
  const [newComment, setNewComment] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredComments = comments.filter((comment) => {
    if (selectedRating === "all") return true;
    return comment.rating === selectedRating;
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const comment: Comment = {
      id: comments.length + 1,
      name: newComment.name,
      rating: newComment.rating,
      verified: false,
      comment: newComment.comment,
      timestamp: new Date().toISOString(),
      replies: [],
    };
    setComments([...comments, comment]);
    setNewComment({ name: "", rating: 5, comment: "" });
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return;

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: comment.replies.length + 1,
              name: "Shop Pet",
              comment: replyText,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyText("");
    setReplyTo(null);
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
    <div className="bg-white rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-bold mb-2">
        Đánh giá nhận xét từ khách hàng
      </h2>
      <div className="bg-blue-50 border border-gray-200 rounded p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Khối điểm trung bình và sao */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-3xl font-semibold text-blue-700">4.2/5</div>
          <div className="text-yellow-500 text-xl mb-1">★★★★☆</div>
          <div className="text-sm text-gray-600">(13 đánh giá)</div>
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
              {option.label} ({option.value === "all" ? "" : option.value})
            </button>
          ))}
        </div>
      </div>

      {/* Form thêm bình luận mới */}
      <form onSubmit={handleAddComment} className="mt-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-4">Thêm đánh giá của bạn</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên của bạn
            </label>
            <input
              type="text"
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá
            </label>
            <select
              value={newComment.rating}
              onChange={(e) =>
                setNewComment({
                  ...newComment,
                  rating: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} sao
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhận xét
            </label>
            <textarea
              value={newComment.comment}
              onChange={(e) =>
                setNewComment({ ...newComment, comment: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Gửi đánh giá
          </button>
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="mt-6">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div key={comment.id} className="mb-6 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.name}</span>
                <span className="text-gray-500">({comment.rating} sao)</span>
                {comment.verified && (
                  <span className="text-blue-500">Đã xác nhận</span>
                )}
                <span className="text-sm text-gray-500">
                  {formatDate(comment.timestamp)}
                </span>
              </div>
              <div className="mt-2 text-gray-700">{comment.comment}</div>

              {/* Phần trả lời */}
              {comment.replies.length > 0 && (
                <div className="ml-8 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText("");
                      }}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
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
