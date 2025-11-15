"use client";

import React, { useState } from "react";
import SectionHeader from "../section-header";
import { Brand } from "@/interface/brand";
import { Image, App } from "antd";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useRouter } from "next/navigation";
import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

interface ProductBrandProps {
  brandsData?: { brands?: Brand[] };
}

const ProductBrand: React.FC<ProductBrandProps> = ({ brandsData }) => {
  const brands = brandsData?.brands || [];
  const router = useRouter();
  const [loadingBrand, setLoadingBrand] = useState<string | null>(null);
  const { message } = App.useApp();

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
    <div>
      <SectionHeader title="Nhãn hiệu tin dùng" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 me-25 ms-30 my-15">
        {brands.map((brand: Brand) => {
          // Normalize image URL sử dụng utility function
          const src = normalizeImageUrl(brand.image);
          const isLoading = loadingBrand === brand._id;
          return (
            <div
              key={brand._id}
              onClick={() => handleBrandClick(brand.name, brand._id)}
              className={`group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:border-white/10 ${
                isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-full flex items-center justify-center">
                  <Image
                    src={src}
                    alt={brand.name}
                    preview={false}
                    className="h-20 w-auto max-w-[120px] object-contain rounded-md grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                  {brand.name}
                  {isLoading && "..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductBrand;
