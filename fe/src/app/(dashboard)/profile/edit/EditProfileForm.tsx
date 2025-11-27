"use client";

import React, { useState } from "react";
import { App, Form, Input } from "antd";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  // Dùng kiểu lỏng để tránh lệch schema giữa FE/BE
  user: {
    _id: string;
    name?: string;
    email?: string;
    username?: string;
    phone?: string;
    note?: string;
  };
}

interface FormValues {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  note?: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (data.ok) {
        message.success(data.message || "Cập nhật thông tin thành công");
        router.push("/profile");
      } else {
        message.error(data.message || "Cập nhật thông tin thất bại");
      }
    } catch (error: any) {
      message.error(error?.message || "Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      initialValues={{
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        note: user?.note || "",
      }}
      onFinish={onFinish}
      className="mt-4 space-y-3"
    >
      <Form.Item
        label="Họ và tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item label="Tên tài khoản" name="username">
        <Input placeholder="Nhập tên tài khoản" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email", message: "Email không hợp lệ" }]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phone">
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
      </Form.Item>

      <div className="flex items-center gap-3 pt-2">
        <Button
          htmlType="submit"
          variant="default"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-full py-2 px-6 shadow hover:scale-[1.01] transition"
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
        >
          Hủy
        </button>
      </div>
    </Form>
  );
};

export default EditProfileForm;


