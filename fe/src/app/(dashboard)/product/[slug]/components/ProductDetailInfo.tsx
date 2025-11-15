"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaMoneyCheckAlt,
  FaUndoAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { MdSupportAgent, MdPayment } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMinus, HiPlus } from "react-icons/hi";
import { App } from "antd";
import useCartStore from "@/store/cart-store";
import { Product } from "../../../../../interface/product";
import resolveImageSrc from "@/utils/resolveImageSrc";
import { useRouter } from "next/navigation";
import useBuyStore from "@/store/buy-store";
import clsx from "clsx";

const ProductDetailInfo = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { message } = App.useApp();

  const productName = product.title;
  const productQuantity = product.quantity;
  const productType = [{ name: product.brand, url: "#" }];
  const [quantity, setQuantity] = useState("1");
  const [showMaxWarning, setShowMaxWarning] = useState(false);

  const getQuantity = () => Math.max(1, parseInt(quantity) || 1);
  const addToCart = useCartStore((state) => state.addToCart);
  const setBuyNow = useBuyStore((state) => state.setBuyNow);

  // Ẩn warning sau 3 giây
  useEffect(() => {
    if (showMaxWarning) {
      const timer = setTimeout(() => setShowMaxWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMaxWarning]);

  // Calculate actual price (with discount if applicable)
  const getActualPrice = () => {
    if (product.isSaleProduct && product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };
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
      {product.isSaleProduct && product.discount > 0 ? (
        <div className="flex items-center align-bottom bg-white rounded-lg px-4 py-2 w-fit gap-3 shadow-sm">
          <div className="flex items-baseline gap-3">
            {/* Giá sau giảm */}
            <span className="text-3xl font-bold text-orange-600">
              {(product.price * (1 - product.discount / 100)).toLocaleString(
                "vi-VN"
              )}
              <span className="text-lg font-normal">₫</span>
            </span>

            {/* Giá gốc */}
            <span className="text-lg text-gray-400 line-through">
              {product.price.toLocaleString("vi-VN")}
              <span className="text-sm font-normal">₫</span>
            </span>
          </div>

          {/* Badge giảm giá */}
          <span className="text-sm items-center! font-bold text-white bg-red-500 rounded-lg px-2 py-1">
            -{product.discount.toLocaleString()}%
          </span>
        </div>
      ) : (
        <div className="flex bg-white rounded-lg px-4 py-2 w-fit">
          <span className="text-3xl font-bold text-orange-700">
            {product.price.toLocaleString("vi-VN")}
            <span className="text-lg font-normal">₫</span>
          </span>
        </div>
      )}
      {/* Số lượng */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium">Số lượng:</span>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 cursor-pointer rounded-full bg-white border border-gray-300 text-xl flex items-center justify-center shadow hover:bg-orange-100 hover:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
              onClick={() => {
                const newQty = Math.max(1, getQuantity() - 1);
                setQuantity(String(newQty));
                setShowMaxWarning(false);
              }}
              disabled={getQuantity() <= 1}
              aria-label="Giảm số lượng"
            >
              <HiMinus />
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;

                // Cho phép rỗng khi đang xoá
                if (val === "") {
                  setQuantity("");
                  setShowMaxWarning(false);
                  return;
                }

                // Chỉ cho nhập số
                if (!/^[0-9]+$/.test(val)) return;

                let num = parseInt(val);

                // Ngăn số dưới 1
                if (num < 1) {
                  num = 1;
                  setQuantity("1");
                  return;
                }

                // Giới hạn số lượng tối đa
                if (num > productQuantity) {
                  num = productQuantity;
                  setQuantity(String(productQuantity));
                  setShowMaxWarning(true);
                  message.warning(
                    `Số lượng tối đa là ${productQuantity}. Chỉ còn ${productQuantity} sản phẩm trong kho.`
                  );
                } else {
                  setShowMaxWarning(false);
                }

                setQuantity(String(num));
              }}
              onBlur={() => {
                // Nếu rỗng -> trả về 1
                if (!quantity || parseInt(quantity) < 1) {
                  setQuantity("1");
                }
                // Nếu vượt quá max -> set về max
                else if (parseInt(quantity) > productQuantity) {
                  setQuantity(String(productQuantity));
                  setShowMaxWarning(true);
                }
              }}
              className={clsx(
                "w-16 h-9 text-center border rounded-lg shadow focus:outline-none text-lg font-semibold transition-colors",
                showMaxWarning || Number(quantity) >= productQuantity
                  ? "border-orange-400 bg-orange-50 focus:ring-2 focus:ring-orange-400"
                  : "border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400"
              )}
              inputMode="numeric"
              pattern="[0-9]*"
            />

            <button
              className={clsx(
                "w-9 h-9 rounded-full cursor-pointer bg-white border text-xl flex items-center justify-center shadow transition",
                Number(quantity) >= productQuantity
                  ? "border-gray-300 cursor-not-allowed opacity-50 hover:bg-white hover:border-gray-300"
                  : "border-gray-300 hover:bg-orange-100 hover:border-orange-400"
              )}
              onClick={() => {
                const currentQty = getQuantity();
                if (currentQty < productQuantity) {
                  const newQty = currentQty + 1;
                  setQuantity(String(newQty));
                  setShowMaxWarning(false);

                  // Nếu đạt max sau khi tăng
                  if (newQty >= productQuantity) {
                    setShowMaxWarning(true);
                    message.warning(
                      `Số lượng tối đa là ${productQuantity}. Chỉ còn ${productQuantity} sản phẩm trong kho.`
                    );
                  }
                } else {
                  message.warning(
                    `Số lượng tối đa là ${productQuantity}. Chỉ còn ${productQuantity} sản phẩm trong kho.`
                  );
                }
              }}
              disabled={Number(quantity) >= productQuantity}
              aria-label="Tăng số lượng"
            >
              <HiPlus />
            </button>
          </div>
          {productQuantity > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              (Còn {productQuantity} sản phẩm)
            </span>
          )}
        </div>

        {/* Warning message khi đạt max */}
        {showMaxWarning && (
          <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Số lượng tối đa là <strong>{productQuantity}</strong>. Chỉ còn{" "}
              <strong>{productQuantity}</strong> sản phẩm trong kho.
            </span>
          </div>
        )}

        {/* Thông báo hết hàng */}
        {productQuantity === 0 && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Sản phẩm đã hết hàng</span>
          </div>
        )}
      </div>
      {/* Nút hành động */}
      <div className="flex gap-4 mt-4">
        <button
          className={clsx(
            "flex-1 py-3 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all",
            productQuantity === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 cursor-pointer"
          )}
          onClick={() => {
            if (productQuantity === 0) {
              message.error("Sản phẩm đã hết hàng");
              return;
            }
            addToCart({
              id: product._id,
              name: product.title,
              desc: product.description,
              price: getActualPrice(),
              img:
                resolveImageSrc(product.images?.[0]) ||
                "/images/product-fallback.png",
              quantity: getQuantity(),
            });
            message.success(`Đã thêm ${getQuantity()} sản phẩm vào giỏ hàng!`);
          }}
          disabled={productQuantity === 0}
        >
          <FaShoppingCart className="text-xl" />
          {productQuantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </button>
        <button
          className={clsx(
            "flex-1 py-3 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all",
            productQuantity === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 cursor-pointer"
          )}
          onClick={() => {
            if (productQuantity === 0) {
              message.error("Sản phẩm đã hết hàng");
              return;
            }
            setBuyNow({
              id: product._id,
              name: product.title,
              desc: product.description,
              price: getActualPrice(),
              img:
                resolveImageSrc(product.images?.[0]) ||
                "/images/product-fallback.png",
              quantity: getQuantity(),
            });
            router.push("/checkout?from=buy-now");
          }}
          disabled={productQuantity === 0}
        >
          <MdPayment className="text-xl" />
          {productQuantity === 0 ? "Hết hàng" : "Mua ngay"}
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
