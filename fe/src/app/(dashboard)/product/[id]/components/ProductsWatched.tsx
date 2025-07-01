"use client";

import ProductCard from "@/components/product-card";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";

const ProductsWatched = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
  });

  const number = 10;

  return (
    <div className="bg-white rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-bold mb-2">Sản phẩm bạn đã xem</h2>

      {/* Đây là viewport, cần gán ref ở đây */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Đây là track, chứa các slide */}
        <div className="flex gap-4">
          {Array.from({ length: number }).map((_, index) => (
            <div className="flex-1" key={index}>
              <ProductCard
                title="Pate Lon Wow 85g Vị Thịt Gà Và Lòng Đỏ Trứng"
                star={5}
                price={100000}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsWatched;
