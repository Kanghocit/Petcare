"use client";

import React, { useState } from "react";

const COLORS = [
  "Trắng",
  "Đen",
  "Xám",
  "Xanh dương",
  "Đỏ",
  "Vàng",
  "Nâu",
  "Cam",
  "Hồng",
];
const TAGS = ["Flash Sale", "Giao Nhanh 24h"];
const BRANDS = ["Royal Canin", "Snappy Tom", "Catsrang"];
const PRICES = [
  "Giá dưới 1.000.000₫",
  "1.000.000₫ - 2.000.000₫",
  "2.000.000₫ - 3.000.000₫",
  "3.000.000₫ - 5.000.000₫",
  "5.000.000₫ - 7.000.000₫",
  "7.000.000₫ - 10.000.000₫",
  "Giá trên 10.000.000₫",
];

const ProductsFilter = () => {
  const [showAllColors, setShowAllColors] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const visibleColors = showAllColors ? COLORS : COLORS.slice(0, 5);

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-sm">
      <p className="text-2xl font-bold">BỘ LỌC SẢN PHẨM</p>
      <span className="text-sm text-gray-500">
        <i>Giúp lọc nhanh các sản phẩm bạn đang tìm</i>
      </span>
      {/* Màu sắc */}
      <div>
        <h3 className="font-bold mb-2">Màu sắc</h3>
        <div className="flex flex-col gap-2">
          {visibleColors.map((color) => (
            <label
              key={color}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="checkbox" />
              <span>{color}</span>
            </label>
          ))}
          {!showAllColors && (
            <button
              className="text-[#ff9167] font-semibold flex items-center gap-1 mt-1 hover:underline"
              onClick={() => setShowAllColors(true)}
              type="button"
            >
              Xem thêm <span className="text-lg">&#x25BC;</span>
            </button>
          )}
        </div>
      </div>
      <hr className="my-4" />
      {/* Tags */}
      <div>
        <h3 className="font-bold mb-2">Tags</h3>
        <div className="flex flex-col gap-2">
          {TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="my-4" />
      {/* Hãng sản xuất */}
      <div>
        <h3 className="font-bold mb-2">Hãng sản xuất</h3>
        <div className="flex flex-col gap-2">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="checkbox" />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="my-4" />
      {/* Giá */}
      <div>
        <h3 className="font-bold mb-2">Giá</h3>
        <div className="flex flex-col gap-2">
          {PRICES.map((price) => (
            <label
              key={price}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="price"
                value={price}
                checked={selectedPrice === price}
                onChange={() => setSelectedPrice(price)}
              />
              <span>{price}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
