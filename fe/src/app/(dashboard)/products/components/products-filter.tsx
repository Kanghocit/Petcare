"use client";

import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

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
const BRANDS = [
  "Royal Canin",
  "Snappy Tom",
  "Catsrang",
  "Moochie",
  "Kucinta",
  "Catchy",
  "Apro",
];
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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleItem = (
    item: string,
    list: string[],
    setList: (list: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedTags([]);
    setSelectedPrice("");
  };

  const renderCheckbox = (
    label: string,
    isChecked: boolean,
    onChange: () => void
  ) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:bg-blue-400 checked:border-gray-400 checked:border-1  checked:before:text-white checked:before:text-xs checked:before:flex checked:before:justify-center checked:before:items-center"
      />
      <span className={isChecked ? "text-blue-500 font-semibold" : ""}>
        {label}
      </span>
    </label>
  );

  const visibleColors = showAllColors ? COLORS : COLORS.slice(0, 5);

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-sm">
      <p className="text-2xl font-bold">BỘ LỌC SẢN PHẨM</p>
      <span className="text-sm text-gray-500 font-semibold">
        Giúp lọc nhanh các sản phẩm bạn đang tìm
      </span>

      {(selectedBrands.length > 0 ||
        selectedTags.length > 0 ||
        selectedPrice ||
        selectedColors.length > 0) && (
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <p className="font-bold text-sm text-gray-700">LỌC THEO:</p>
            <button
              className="text-red-500 text-sm hover:underline"
              onClick={clearAllFilters}
            >
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedBrands.map((brand) => (
              <div
                key={brand}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                {brand}
                <button
                  onClick={() =>
                    toggleItem(brand, selectedBrands, setSelectedBrands)
                  }
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <CloseOutlined className="text-white text-xs" />
                </button>
              </div>
            ))}
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => toggleItem(tag, selectedTags, setSelectedTags)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <CloseOutlined className="text-white text-xs" />
                </button>
              </div>
            ))}
            {selectedColors.map((color) => (
              <div
                key={color}
                className="bg-blue-700 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                {color}
                <button
                  onClick={() =>
                    toggleItem(color, selectedColors, setSelectedColors)
                  }
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            ))}
            {selectedPrice && (
              <div className="bg-blue-700 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                {selectedPrice}
                <button
                  onClick={() => setSelectedPrice("")}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <hr className="my-4" />

      {/* Thương hiệu */}
      <div>
        <h3 className="font-bold mb-2">Thương hiệu</h3>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {BRANDS.map((brand) =>
            renderCheckbox(brand, selectedBrands.includes(brand), () =>
              toggleItem(brand, selectedBrands, setSelectedBrands)
            )
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* Lọc giá */}
      <div>
        <h3 className="font-bold mb-2">Lọc giá</h3>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
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
                className="w-4 h-4"
              />
              <span
                className={
                  selectedPrice === price ? "text-blue-700 font-medium" : ""
                }
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Tags */}
      <div>
        <h3 className="font-bold mb-2">Tags</h3>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {TAGS.map((tag) =>
            renderCheckbox(tag, selectedTags.includes(tag), () =>
              toggleItem(tag, selectedTags, setSelectedTags)
            )
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* Màu sắc */}
      <div>
        <h3 className="font-bold mb-2">Màu sắc</h3>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {visibleColors.map((color) =>
            renderCheckbox(color, selectedColors.includes(color), () =>
              toggleItem(color, selectedColors, setSelectedColors)
            )
          )}
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
    </div>
  );
};

export default ProductsFilter;
