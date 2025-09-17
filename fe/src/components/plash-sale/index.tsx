"use client";

import React from "react";
import CountdownTimer from "./countdown-timer";
import ProductCard from "../product-card";
import useEmblaCarousel from "embla-carousel-react";
import type { FlashSale, FlashSaleProductItem } from "@/interface/flashSale";

const PlashSale = ({ flashSale }: { flashSale: FlashSale | null }) => {
  console.log("flashSale", flashSale);
  const endTime = flashSale?.endDate || "";
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
    axis: "x",
  });

  if (!flashSale || !flashSale.products?.length) return null;

  return (
    <div className="mt-4 flex flex-col w-fit justify-center items-center mx-auto">
      <div className="flex flex-col bg-[#f96264] mx-40 p-4 rounded-3xl text-white w-[1540px]">
        <div className="flex gap-4 justify-between items-center px-2 rounded-lg text-white">
          <p className="text-[43px] font-bold font-sans">
            Chớp thời cơ. Giá như mơ!
          </p>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-2 items-center text-[18px]">
              <p>Nhanh lên nào!</p>
              <p className="font-bold">Sự kiện kết thúc sau</p>
            </div>
            <div className="flex justify-between items-center">
              <CountdownTimer endTime={endTime} />
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            {/* Container */}
            <div className="flex gap-4 touch-pan-y select-none will-change-transform">
              {flashSale.products.map(
                (item: FlashSaleProductItem, index: number) => {
                  const p = item.productId;
                  const salePrice = item.flashSalePrice;
                  const basePrice = p.price > 0 ? p.price : 0;
                  const computedDiscount =
                    basePrice > 0
                      ? Math.max(
                          0,
                          Math.round((1 - salePrice / basePrice) * 100)
                        )
                      : 0;
                  return (
                    <div key={`flash-sale-slide-${index}`}>
                      <div className="shrink-0 grow-0 basis-[260px] min-w-0">
                        <ProductCard
                          key={`flash-sale-${index}`}
                          id={p._id}
                          img={[p.images?.[0], p.images?.[1]]}
                          title={p.title}
                          star={p.star}
                          price={p.price}
                          isSale={true}
                          discount={computedDiscount}
                          salePrice={salePrice}
                          slug={p.slug}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlashSale;
