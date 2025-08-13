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
  const toAbsolute = (src?: string | null) => {
    if (!src) return null;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      const u = new URL(apiBase);
      u.pathname = u.pathname.replace(/\/api\/?$/, "");
      const base = `${u.origin}${u.pathname}`.replace(/\/$/, "");
      const normalizedSource = src.startsWith("/") ? src : `/${src}`;
      return `${base}${normalizedSource}`;
    } catch {
      const base = apiBase.replace(/\/api\/?$/, "").replace(/\/$/, "");
      const normalizedSource = src.startsWith("/") ? src : `/${src}`;
      return `${base}${normalizedSource}`;
    }
  };
  // Luôn tạo mảng 5 phần tử, nếu thiếu thì thêm null
  const displayImages = [
    ...images.slice(0, 5).map((s) => toAbsolute(s) as string),
    ...Array(5 - images.length).fill(null),
  ].slice(0, 5);

  return (
    <div className="flex flex-col h-[570px]">
      <div className="text-center me-4">
        {displayImages[selected] ? (
          <div className="w-[300px] h-full flex items-center justify-center rounded-md mx-auto">
            <Image
              src={displayImages[selected] as string}
              alt="product"
              width={250}
              height={300}
              quality={100}
              className="w-[300px] h-full object-contain rounded-xl"
            />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center border border-gray-200 rounded-md mx-auto">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center mt-auto shrink-0">
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
