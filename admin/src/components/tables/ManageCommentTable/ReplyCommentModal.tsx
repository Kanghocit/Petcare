"use client";

import { Modal, Form, Input, Button, App } from "antd";
import { useEffect } from "react";
import { Comment } from "@/interface/Comment";

interface ReplyCommentModalProps {
  visible: boolean;
  onCancel: () => void;
  onReply: (content: string) => Promise<void>;
  onUpdate: (content: string) => Promise<void>;
  comment: Comment | null;
  loading?: boolean;
  action: "reply" | "update";
}

const ReplyCommentModal = ({
  visible,
  onCancel,
  onReply,
  onUpdate,
  comment,
  loading = false,
  action,
}: ReplyCommentModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ content: comment?.content || "" });
    }
  }, [visible, comment, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (action === "reply") {
        await onReply(values.content);
      } else {
        await onUpdate(values.content);
      }
      form.resetFields();
    } catch {
      message.error("Vui lòng nhập nội dung phản hồi");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={action === "reply" ? "Phản hồi bình luận" : "Cập nhật phản hồi"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {action === "reply" ? "Gửi phản hồi" : "Cập nhật"}
        </Button>,
      ]}
      width={600}
    >
      {comment && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-medium text-gray-700">
              {comment.userId?.name || "Người dùng"}
            </span>
            <span className="text-sm text-gray-500">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("vi-VN")
                : ""}
            </span>
          </div>
          <p className="text-gray-600">{comment.content}</p>
          {comment.rating && (
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < comment.rating! ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-1 text-xs text-gray-500">
                ({comment.rating}/5)
              </span>
            </div>
          )}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{ content: comment?.content }}
      >
        <Form.Item
          name="content"
          label="Nội dung phản hồi"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung phản hồi" },
            { min: 1, message: "Nội dung phản hồi không được để trống" },
            { max: 500, message: "Nội dung phản hồi không được quá 500 ký tự" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung phản hồi..."
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplyCommentModal;
