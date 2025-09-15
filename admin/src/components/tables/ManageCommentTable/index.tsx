"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { App, Button } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CommentOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import TablePagination from "@/components/tables/TablePagination";
import { useRouter } from "next/navigation";
import { Comment } from "@/interface/Comment";
import {
  deleteCommentAction,
  replyCommentAction,
  updateCommentAction,
  updateCommentStatusAction,
} from "@/app/(admin)/(others-pages)/(tables)/manage-comment-table/action";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReplyCommentModal = dynamic(() => import("./ReplyCommentModal"), {
  ssr: false,
});

const ManageCommentTable = ({
  comments,
}: {
  comments?: { comments: Comment[]; total: number; limit: number };
}) => {
  const { comments: commentsData, total, limit } = comments || {};
  const commentWithoutReply = commentsData?.filter(
    (comment: Comment) => !comment.parentId,
  );

  const router = useRouter();
  const { modal, message } = App.useApp();

  // State for reply modal
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [modalAction, setModalAction] = useState<"reply" | "update">("reply");

  const handleDeleteComment = async (id: string) => {
    modal.confirm({
      title: "Xoá đánh giá",
      content: "Bạn có chắc chắn muốn xoá đánh giá này không?",
      onOk: async () => {
        const res = await deleteCommentAction(id);
        if (res.ok) {
          message.success("Xoá đánh giá thành công");
          router.refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const handleDisableComment = async (id: string) => {
    modal.confirm({
      title: "Vô hiệu hóa đánh giá",
      content: "Bạn có chắc chắn muốn vô hiệu hóa đánh giá này không?",
      onOk: async () => {
        const res = await updateCommentStatusAction(id, "disabled");
        if (res.ok) {
          message.success("Vô hiệu hóa đánh giá thành công");
          router.refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const handleActiveComment = async (id: string) => {
    modal.confirm({
      title: "Kích hoạt đánh giá",
      content: "Bạn có chắc chắn muốn kích hoạt đánh giá này không?",
      onOk: async () => {
        const res = await updateCommentStatusAction(id, "active");
        if (res.ok) {
          message.success("Kích hoạt đánh giá thành công");
          router.refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const handleReplyComment = (comment: Comment) => {
    setSelectedComment(comment);
    setModalAction("reply");
    setReplyModalVisible(true);
  };

  const handleEditReply = (parent: Comment) => {
    const reply = commentsData?.find((c: Comment) => c.parentId === parent._id);
    if (!reply) {
      message.error("Chưa có phản hồi để chỉnh sửa");
      return;
    }
    setSelectedComment(reply);
    setModalAction("update");
    setReplyModalVisible(true);
  };

  const handleReplySubmit = async (content: string) => {
    if (!selectedComment) return;

    setReplyLoading(true);
    try {
      const res = await replyCommentAction(selectedComment._id, content);
      if (res.ok) {
        message.success("Phản hồi thành công");
        setReplyModalVisible(false);
        setSelectedComment(null);
        router.refresh();
      } else {
        message.error(res.message || "Phản hồi thất bại");
      }
    } catch {
      message.error("Phản hồi thất bại");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyModalVisible(false);
    setSelectedComment(null);
  };

  const handleUpdateComment = async (content: string) => {
    if (!selectedComment) return;
    setReplyLoading(true);
    try {
      const res = await updateCommentAction(selectedComment._id, content);
      if (res.ok) {
        message.success("Cập nhật phản hồi thành công");
        setReplyModalVisible(false);
        setSelectedComment(null);
        router.refresh();
      } else {
        message.error(res.message || "Cập nhật phản hồi thất bại");
      }
    } catch {
      message.error("Cập nhật phản hồi thất bại");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Người đánh giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Nội dung
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ngày đánh giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Đã phản hồi
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Đánh giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {commentWithoutReply?.map((comment: Comment) => (
                <TableRow
                  key={comment._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {comment.userId?.name ||
                        comment._id.slice(-8).toUpperCase()}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm w-1/4 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-2 max-w-[200px] text-gray-800 dark:text-white/90">
                      {comment.content || "--"}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {comment.productId?.title || "--"}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "--"}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {comment.isReply ? (
                      <CheckCircleOutlined className="text-xl !text-green-500" />
                    ) : (
                      <CloseCircleOutlined className="text-xl !text-red-500" />
                    )}
                  </TableCell>

                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      {comment.rating ? (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < comment.rating!
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-1 text-xs text-gray-500">
                            ({comment.rating}/5)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <Button
                      className="!color-green-500 disabled:!hover:!border-gray-300 disabled:!hover:!text-gray-300 !border-green-500 hover:!border-green-400 hover:!text-green-400 disabled:!border-gray-300 disabled:!text-gray-300"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<MessageOutlined className="!text-green-400" />}
                      onClick={() => handleReplyComment(comment)}
                      title="Phản hồi"
                      disabled={comment.isReply}
                    />

                    <Button
                      className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<CommentOutlined className="!text-blue-400" />}
                      onClick={() => handleEditReply(comment)}
                      title="Chỉnh sửa"
                      disabled={!comment.isReply}
                    />
                    {comment.status === "active" ? (
                      <Button
                        className="!color-yellow-500 !border-yellow-500 hover:!border-yellow-400 hover:!text-yellow-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<CloseOutlined className="!text-yellow-400" />}
                        onClick={() => handleDisableComment(comment._id)}
                        title="Vô hiệu hóa"
                      />
                    ) : (
                      <Button
                        className="!color-green-500 !border-green-500 hover:!border-green-400 hover:!text-green-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<CheckOutlined className="!text-green-400" />}
                        title="Kích hoạt"
                        onClick={() => handleActiveComment(comment._id)}
                      />
                    )}
                    <Button
                      className="!color-red-500 !border-red-500 hover:!border-red-400 hover:!text-red-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<DeleteOutlined className="!text-red-400" />}
                      onClick={() => handleDeleteComment(comment._id)}
                      title="Xóa"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            total={total || 0}
            link="/manage-comment-table"
            limit={limit || 5}
          />
        </div>
      </div>

      {/* Reply Comment Modal */}
      <ReplyCommentModal
        visible={replyModalVisible}
        onCancel={handleReplyCancel}
        onReply={handleReplySubmit}
        onUpdate={handleUpdateComment}
        action={modalAction}
        comment={selectedComment}
        loading={replyLoading}
      />
    </div>
  );
};

export default ManageCommentTable;
