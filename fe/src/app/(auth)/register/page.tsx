"use client";

import React, { useState } from "react";
import { App, Form, Input } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import Button from "@/components/button";
import Link from "next/link";
import FloatingSquare from "@/components/floating-square";
import { useRouter } from "next/navigation";

interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const onFinish = async (values: RegisterFormValues) => {
    console.log(values);
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (data.ok) {
        console.log("Đăng ký thành công", data);
        form.resetFields();
        message.success(data.message);
        router.push("/login");
      } else {
        message.error(data.message);
      }
      setIsLoading(false);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error?.message || "Đăng ký thất bại");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-cyan-200 to-blue-200 font-[Quicksand]">
      {/* Hình vuông mờ di chuyển */}
      <FloatingSquare
        delay={0}
        position={{ top: "10%", left: "29%" }}
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
        position={{ top: "60%", right: "29%" }}
        zIndex={10}
      />

      {/* Form đăng nhập của bạn ở đây */}

      <div className="bg-white/80 rounded-3xl p-10 w-full max-w-xl shadow-2xl backdrop-blur-md border border-white/60 flex flex-col gap-3 z-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center font-[Quicksand]">
          Đăng ký tài khoản
        </h1>
        <p className="text-base text-blue-500 mb-8 text-center">
          🐾 “Chỉ vài giây để bắt đầu hành trình cùng thú cưng của bạn!”
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="space-y-2"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input
              placeholder="Họ và tên"
              autoComplete="off"
              className="!rounded-full !px-4 !py-3 !bg-white  !border-none !font-semibold shadow-blue-50 shadow-2xl"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
          >
            <Input
              placeholder="Tên tài khoản"
              autoComplete="off"
              className="!rounded-full !px-4 !py-3 !bg-white !border-none !font-semibold shadow-blue-50 shadow-2xl"
            />
          </Form.Item>

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

          <Form.Item>
            <Button
              htmlType="submit"
              variant="default"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-full py-3 px-4 shadow-lg hover:scale-101 transition"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
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

        <Link href="/login">
          <Button
            variant="none"
            className="w-full px-4 rounded-full bg-white !text-blue-600 hover:bg-blue-50 font-bold py-3 mb-2 shadow"
          >
            Đăng nhập
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

export default RegisterForm;
