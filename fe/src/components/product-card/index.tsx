"use client";

import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Rate, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import useCartStore from "@/store/cart-store";
import resolveImageSrc from "@/utils/resolveImageSrc";

type ProductCardProps = {
  img?: [string, string];
  id?: string;
  title: string;
  slug: string;
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
  id,
  title,
  slug,
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

  const primaryImg = resolveImageSrc(img?.[0]);
  const hoverImg = resolveImageSrc(img?.[1]);

  return (
    <div
      className={`w-64 !rounded-2xl p-3 shadow-sm hover:shadow-lg transition relative group bg-white my-2 ${className}`}
    >
      <Link href={`/product/${slug}`}>
        <div className="relative w-full overflow-hidden group rounded-md">
          {primaryImg && (
            <Image
              src={primaryImg}
              alt="product"
              width={250}
              height={250}
              className=" object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
          )}
          {hoverImg && (
            <Image
              src={hoverImg}
              alt="hover"
              width={250}
              height={250}
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
          <div className="text-sm font-semibold mt-1 flex items-center justify-between">
            {isSale && typeof salePrice === "number" ? (
              <div className="flex flex-col">
                <span className="text-red-500 text-xl">
                  {salePrice.toLocaleString()}₫
                </span>
                <div className="flex gap-2 items-center">
                  <span className="line-through text-gray-500">
                    {price.toLocaleString()}₫
                  </span>
                  <span className="text-white bg-red-500 rounded-xl px-2">
                    {discount.toLocaleString()}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 ">
                <span className="text-red-500 text-xl">
                  {price.toLocaleString()}₫
                </span>
              </div>
            )}
            <button
              className="!rounded-full !w-10 h-10 !bg-[#FFEDE5] !text-[#ff8662] hover:!bg-[#FFEDE5]/80 cursor-pointer"
              onClick={() =>
                addToCart({
                  id: id || slug,
                  name: title,
                  desc: title,
                  price: price,
                  img: primaryImg || "/images/account.webp",
                  quantity: 1,
                })
              }
            >
              <ShoppingCartOutlined />
            </button>
          </div>

          {/* Vừa mở bán */}
          {isNew && <p className="text-sm text-gray-500 !mb-0">Vừa mở bán</p>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
