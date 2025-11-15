"use client";

import React, { useState } from "react";
import { Image, App } from "antd";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { useRouter } from "next/navigation";
import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface BrandListProps {
  brands: Brand[];
  selectedLetter: string;
}

const BrandList: React.FC<BrandListProps> = ({ brands, selectedLetter }) => {
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
        });
      }
    } catch {
      message.error({
        content: "Không thể kiểm tra sản phẩm của thương hiệu này",
        duration: 3,
      });
    } finally {
      setLoadingBrand(null);
    }
  };

  // Group brands by first letter
  const groupedBrands = React.useMemo(() => {
    const groups: { [key: string]: Brand[] } = {};

    brands.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(brand);
    });

    // Sort groups by letter
    const sortedGroups = Object.keys(groups)
      .sort()
      .reduce((result, key) => {
        result[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
        return result;
      }, {} as { [key: string]: Brand[] });

    return sortedGroups;
  }, [brands]);

  // Filter brands based on selected letter
  const filteredGroups = React.useMemo(() => {
    if (selectedLetter === "Tất cả") {
      return groupedBrands;
    }

    if (selectedLetter === "#") {
      // Show brands that start with numbers or special characters
      const numberGroups: { [key: string]: Brand[] } = {};
      Object.keys(groupedBrands).forEach((letter) => {
        if (!/[A-Z]/.test(letter)) {
          numberGroups[letter] = groupedBrands[letter];
        }
      });
      return numberGroups;
    }

    return groupedBrands[selectedLetter]
      ? { [selectedLetter]: groupedBrands[selectedLetter] }
      : {};
  }, [groupedBrands, selectedLetter]);

  return (
    <div className="space-y-10">
      {Object.keys(filteredGroups).map((letter) => (
        <div key={letter} className="flex gap-8 border-b border-gray-200 pb-8">
          {/* Letter header */}
          <div className="w-16 shrink-0">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-200 sticky top-4">
              {letter}
            </h2>
          </div>

          {/* Brands grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGroups[letter].map((brand) => {
                const isLoading = loadingBrand === brand.id;
                return (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandClick(brand.name, brand.id)}
                    className={`group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200/70 dark:bg-white/5 dark:border-white/10 ${
                      isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-50 ring-1 ring-gray-100 overflow-hidden grid place-items-center dark:bg-white/5 dark:ring-white/10">
                        {(() => {
                          const logoSrc = normalizeImageUrl(brand.logo);
                          return logoSrc ? (
                            <Image
                              width={40}
                              height={40}
                              src={logoSrc}
                              alt={brand.name}
                              className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs font-semibold text-gray-500">
                              {brand.name.charAt(0).toUpperCase()}
                            </span>
                          );
                        })()}
                      </div>
                      <span className="text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {brand.name}
                        {isLoading && "..."}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(filteredGroups).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy thương hiệu nào bắt đầu bằng &quot;{selectedLetter}
            &quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandList;
