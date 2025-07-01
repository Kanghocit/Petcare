"use client";

import React, { useState } from "react";
import Image from "next/image";
interface ProductDetailPictureProps {
  images: string[];
}

const ProductDetailPicture: React.FC<ProductDetailPictureProps> = ({
  images,
}) => {
  const [selected, setSelected] = useState(0);
  // Luôn tạo mảng 5 phần tử, nếu thiếu thì thêm null
  const displayImages = [
    ...images.slice(0, 5),
    ...Array(5 - images.length).fill(null),
  ].slice(0, 5);

  return (
    <div>
      <div className="text-center me-4">
        {displayImages[selected] ? (
          <Image
            src={displayImages[selected] as string}
            alt="product"
            width={350}
            height={350}
            quality={100}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="w-[350px] h-[350px] bg-gray-100 flex items-center justify-center border border-gray-200 rounded-md mx-auto">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              width: 130,
              height: 130,
              flex: "0 0 130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {img && (
              <Image
                src={img}
                alt={`thumb-${idx}`}
                width={130}
                height={130}
                quality={100}
                className={`object-contain border-2 cursor-pointer rounded-md bg-white transition-all duration-200 ${
                  selected === idx
                    ? "border-orange-500 shadow-lg scale-105"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                }`}
                onClick={() => setSelected(idx)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPicture;
