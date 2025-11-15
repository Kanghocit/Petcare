"use client";

import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Image, App } from "antd";
import { Brand } from "@/interface/brand";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useRouter } from "next/navigation";
import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

const BrandCarousel = ({ brands }: { brands: Brand[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const router = useRouter();
  const [loadingBrand, setLoadingBrand] = useState<string | null>(null);
  const { message } = App.useApp();

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleBrandClick = async (brandName: string, brandId: string) => {
    if (loadingBrand === brandId) return; // Prevent double clicks

    setLoadingBrand(brandId);
    try {
      // Check if brand has products
      const params = new URLSearchParams();
      params.append("brand", brandName);
      params.append("limit", "1"); // Only check if products exist, limit to 1
      params.append("page", "1");

      const response = await fetchWithoutToken(
        `/product?${params.toString()}`,
        "GET"
      );

      if (response?.products && response.products.length > 0) {
        // Brand has products, navigate to products page with brand filter
        router.push(`/products?brand=${encodeURIComponent(brandName)}`);
      } else {
        // Brand has no products, show message and don't navigate
        message.warning({
          content: `Thương hiệu "${brandName}" hiện chưa có sản phẩm`,
          duration: 4, // Hiển thị trong 4 giây
          style: {
            marginTop: '20vh',
          },
        });
      }
    } catch (error: any) {
      message.error({
        content: error?.message || "Không thể kiểm tra sản phẩm của thương hiệu này",
        duration: 3,
      });
    } finally {
      setLoadingBrand(null);
    }
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {brands.map((brand) => {
            const imageSrc = normalizeImageUrl(brand.image);
            const isLoading = loadingBrand === brand._id;
            return (
              <div key={brand._id} className="flex-none w-96">
                <div
                  onClick={() => handleBrandClick(brand.name, brand._id)}
                  className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                    isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-96 h-32 mb-3 flex items-center justify-center">
                      <Image
                        width={200}
                        height={200}
                        src={imageSrc}
                        alt={brand.name}
                        preview={false}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {brand.name}
                      {isLoading && "..."}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
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
