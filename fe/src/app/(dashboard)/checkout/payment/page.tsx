"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Image } from "antd";

// Note: Metadata cannot be exported from client components
// This page is client-side for payment processing

type PaymentDetailParams = {
  amount: number;
  content: string;
  bankName?: string;
  accName?: string;
  accNo?: string;
};

const formatVnd = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

const PaymentPage: React.FC = () => {
  const params = useSearchParams();
  // get values from query (with sensible defaults)
  const data: PaymentDetailParams = {
    amount: Number(params.get("amount") || 100),
    content: params.get("content") || "DH",
    accName: params.get("accName") || "BUI AN KHANG",
    accNo: params.get("accNo") || "034203005533",
  };

  const qrImageUrl = `https://qr.sepay.vn/img?acc=VQRQAEEHQ8209&bank=MBBank&amount=${
    data.amount || 0
  }&des=${data.content}`;

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col gap-6">
        {/* Left: QR panel */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-5">
          <h3 className="text-center text-red-500 font-semibold mb-4">
            Quét Mã QR Để Thanh Toán
          </h3>
          <div className="flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <Image
                height={240}
                width={240}
                src={qrImageUrl}
                alt="QR thanh toán"
                className="object-contain"
                preview={false}
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Sử dụng ứng dụng ngân hàng của bạn để quét mã QR này
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <button className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
              Mở trong Ứng dụng Ngân hàng
            </button>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
              Tải mã QR
            </button>
          </div>
        </div>

        {/* Right: Bank detail card */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-5">
          <h3 className="text-gray-800 font-semibold mb-4">
            Chi Tiết Thanh Toán
          </h3>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {(data.bankName || "MB").slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {data.bankName}
                </div>
                <div className="text-xs text-gray-500">
                  Chuyển Khoản Ngân Hàng
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <span className="text-gray-500">Chủ Tài Khoản</span>
                <span className="font-medium text-right text-gray-900">
                  {data.accName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <span className="text-gray-500">Số Tài Khoản</span>
                <span className="font-medium text-right text-gray-900">
                  {data.accNo}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <span className="text-gray-500">Số Tiền</span>
                <span className="font-semibold text-right text-gray-900">
                  {formatVnd(data.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Nội Dung Chuyển Khoản</span>
                <span className="font-medium text-right break-all max-w-[60%] text-gray-900">
                  {data.content}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">Tổng Tiền</span>
              <span className="text-red-500 font-semibold">
                {formatVnd(data.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
