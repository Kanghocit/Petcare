"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { Brand } from "@/interface/brand";

const BrandCarousel = ({ brands }: { brands: Brand[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {brands.map((brand) => (
            <div key={brand._id} className="flex-none w-96">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-96 h-32 mb-3 flex items-center justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={
                        brand.image?.startsWith("http")
                          ? brand.image
                          : `http://localhost:8000${brand.image}`
                      }
                      alt={brand.name}
                      preview={false}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <LeftOutlined className="w-5 h-5 text-gray-600" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <RightOutlined className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default BrandCarousel;
