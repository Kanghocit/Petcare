"use client";

import React, { useState } from "react";
import { App, Checkbox, Form, Input } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import Button from "@/components/button";
import Link from "next/link";
import FloatingSquare from "@/components/floating-square";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (data.ok) {
        form.resetFields();
        message.success(data.message);
        router.push("/");
      } else {
        message.error(data.message);
      }
      setIsLoading(false);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error?.message || "Đăng nhập thất bại");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-cyan-200 to-blue-200 font-[Quicksand]">
      {/* Hình vuông mờ di chuyển */}
      <FloatingSquare
        delay={0}
        position={{ top: "15%", left: "29%" }}
        zIndex={1}
      />
      <FloatingSquare
        delay={2}
        position={{ top: "60%", left: "29%" }}
        zIndex={30}
      />
      <FloatingSquare
        delay={4}
        position={{ top: "30%", right: "29%" }}
        zIndex={20}
      />
      <FloatingSquare
        delay={4}
        position={{ top: "75%", right: "29%" }}
        zIndex={10}
      />

      {/* Form đăng nhập */}

      <div className="bg-white/80 rounded-3xl p-10 w-full max-w-xl shadow-2xl backdrop-blur-md border border-white/60 flex flex-col gap-3 z-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center font-[Quicksand]">
          Đăng nhập
        </h1>
        <p className="text-base text-blue-500 mb-8 text-center">
          🐾 Tái ngộ để yêu thương – đăng nhập ngay nhé!
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="space-y-2"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              placeholder="Email"
              autoComplete="off"
              className="!rounded-full !px-4 !py-3 !bg-white !border-none !font-semibold shadow-blue-50 shadow-2xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              autoComplete="off"
              className="!rounded-full !px-4 !py-3 !bg-white !border-none !font-semibold shadow-blue-50 shadow-2xl"
            />
          </Form.Item>

          <div className="flex justify-between mx-2">
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
            <Link href="/forgot-password" className="text-blue-500">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              htmlType="submit"
              variant="default"
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-full py-3 px-4 shadow-lg hover:scale-101 transition"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>

        <div className="relative mt-8 mb-4">
          <hr className="border-blue-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white text-blue-600 text-md rounded-full shadow font-medium">
            Hoặc đăng nhập qua
          </span>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="none"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-blue-50 transition !text-blue-600 border-blue-400 border font-semibold"
          >
            <FacebookOutlined /> Facebook
          </Button>
          <Button
            variant="none"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-blue-50 transition !text-red-500 border-blue-400 border font-semibold"
          >
            <GoogleOutlined /> Google
          </Button>
        </div>

        <Link href="/register">
          <Button
            variant="none"
            className="w-full px-4 rounded-full bg-white !text-blue-600 hover:bg-blue-50 font-bold py-3 mb-2 shadow"
          >
            Đăng ký
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="none"
            className="w-full px-4 rounded-full bg-white !text-gray-500 hover:bg-gray-100 font-bold py-3 shadow"
          >
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
