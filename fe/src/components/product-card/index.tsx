"use client";

import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Rate, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import useCartStore from "@/store/cart-store";

type ProductCardProps = {
  img?: [string, string];
  title: string;
  star: number; // từ 1 đến 5
  price: number;
  isSale?: boolean;
  discount?: number;
  isNew?: boolean;
  salePrice?: number;
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  img,
  title,
  star,
  price,
  isSale = false,
  discount = 0,
  salePrice,
  isNew = false,
  className = "",
}) => {
  const text = <span>Xem nhanh</span>;
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div
      className={`w-75 !rounded-2xl p-3 shadow-sm !min-h-[350px] hover:shadow-lg transition relative group bg-white my-2 ${className}`}
    >
      <Link href={`/product/${title}`}>
        <div className="relative w-full h-64 overflow-hidden group rounded-md">
          {img?.[0] && (
            <Image
              src={img[0]}
              alt="product"
              width={100}
              height={100}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
          )}
          {img?.[1] && (
            <Image
              src={img[1]}
              alt="hover"
              width={100}
              height={100}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-3 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 border-1 border-gray-200 rounded-full">
            <Tooltip placement="left" title={text}>
              <EyeOutlined className="!text-black text-xl rounded-full p-2 cursor-pointer" />
            </Tooltip>
          </div>
        </div>

        <div className="my-3">
          <p className="text-black font-bold mb-1 line-clamp-2 group-hover:text-[#ffc226] cursor-pointer">
            {title}
          </p>

          {/* Ant Design Rate */}
          <Rate
            allowHalf
            disabled
            defaultValue={star}
            className="text-yellow-400 text-sm"
          />

          {/* Giá tiền */}
          <div className="text-sm font-semibold mt-1">
            {isSale && typeof salePrice === "number" ? (
              <div className="flex flex-col">
                <span className="text-red-500 text-xl">
                  {salePrice.toLocaleString()}₫
                </span>
                <div className="flex gap-2 items-center">
                  <span className="line-through text-gray-500">
                    {price.toLocaleString()}₫
                  </span>
                  <span className="text-white bg-red-500 rounded-xl px-2 py-1">
                    {discount.toLocaleString()}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-red-500 text-xl">
                  {price.toLocaleString()}₫
                </span>
                <button
                  className="!rounded-full !w-10 h-10 !bg-[#FFEDE5] !text-[#ff8662] hover:!bg-[#FFEDE5]/80 cursor-pointer"
                  onClick={() =>
                    addToCart({
                      id: 1,
                      name: "Sản phẩm 1",
                      desc: "Mô tả sản phẩm 1",
                      price: 100000,
                      img: "/images/news-img.webp",
                      quantity: 1, // hoặc số lượng chọn
                    })
                  }
                >
                  <ShoppingCartOutlined />
                </button>
              </div>
            )}
          </div>

          {/* Vừa mở bán */}
          {isNew && <p className="text-sm text-gray-500 !mb-0">Vừa mở bán</p>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
