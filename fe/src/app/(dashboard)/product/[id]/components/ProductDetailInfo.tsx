"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  FaTruck,
  FaMoneyCheckAlt,
  FaUndoAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { MdSupportAgent, MdPayment } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMinus, HiPlus } from "react-icons/hi";

const ProductDetailInfo = () => {
  // Dữ liệu mẫu, có thể thay bằng props sau này
  const productName = "Pate lon WOW 85g cho mèo vị thịt gà và lòng đỏ trứng";
  const productType = [
    { name: "Pate", url: "#" },
    { name: "thức ăn ướt cho mèo", url: "#" },
  ];
  const price = 13000;
  const [quantity, setQuantity] = useState("1");

  // Chỉ nhận số hoặc rỗng
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setQuantity(val);
    }
  };

  const getQuantity = () => Math.max(1, parseInt(quantity) || 1);

  return (
    <div className="flex flex-col gap-4">
      {/* Tên sản phẩm */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        {productName}
      </h1>
      {/* Loại sản phẩm */}
      <div className="text-base text-gray-600">
        Loại:{" "}
        {productType.map((t, i) => (
          <Link key={i} href={t.url} className="text-green-600 hover:underline">
            {t.name}
            {i < productType.length - 1 && ", "}
          </Link>
        ))}
      </div>
      {/* Giá */}
      <div className="bg-white rounded-lg px-4 py-2 w-fit">
        <span className="text-3xl font-bold text-orange-700">
          {price.toLocaleString("vi-VN")}
          <span className="text-lg font-normal">₫</span>
        </span>
      </div>
      {/* Số lượng */}
      <div className="flex items-center gap-3">
        <span className="text-base font-medium">Số lượng:</span>
        <button
          className="w-9 h-9 rounded-full bg-white border border-gray-300 text-xl flex items-center justify-center shadow hover:bg-orange-100 hover:border-orange-400 transition"
          onClick={() => setQuantity(String(Math.max(1, getQuantity() - 1)))}
          aria-label="Giảm số lượng"
        >
          <HiMinus />
        </button>
        <input
          type="text"
          value={quantity}
          onChange={handleChange}
          onBlur={() => {
            if (!quantity || parseInt(quantity) < 1) setQuantity("1");
          }}
          className="w-14 h-9 text-center border border-gray-300 rounded-lg shadow focus:outline-orange-400 text-lg font-semibold"
        />
        <button
          className="w-9 h-9 rounded-full bg-white border border-gray-300 text-xl flex items-center justify-center shadow hover:bg-orange-100 hover:border-orange-400 transition"
          onClick={() => setQuantity(String(getQuantity() + 1))}
          aria-label="Tăng số lượng"
        >
          <HiPlus />
        </button>
      </div>
      {/* Nút hành động */}
      <div className="flex gap-4 mt-4">
        <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all">
          <FaShoppingCart className="text-xl" />
          Thêm vào giỏ hàng
        </button>
        <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all">
          <MdPayment className="text-xl" />
          Mua ngay
        </button>
      </div>
      {/* Box dịch vụ */}
      <div className="bg-blue-100 rounded-lg p-4 flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2 text-gray-700 text-base">
          <FaTruck className="text-lg" /> Mã Freeship cho đơn hàng trên 200.000₫
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-base">
          <TbTruckDelivery className="text-lg" /> Giao hàng trong 2 giờ nội
          thành Vinh.
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-base">
          <FaMoneyCheckAlt className="text-lg" /> Thanh toán đơn giản, bảo mật
          với VietQR.
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-base">
          <FaUndoAlt className="text-lg" /> Đổi trả dễ dàng, nhanh gọn trong 7
          ngày.
        </div>
      </div>
      {/* Box hỗ trợ mua hàng */}
      <div className="bg-yellow-100 rounded-lg p-4 flex items-center gap-3 mt-2">
        <MdSupportAgent className="text-3xl text-orange-400" />
        <div>
          <div className="font-semibold text-base text-yellow-900">
            Hỗ trợ mua hàng
          </div>
          <div className="text-2xl font-bold text-blue-700">0975 13 50 36</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
