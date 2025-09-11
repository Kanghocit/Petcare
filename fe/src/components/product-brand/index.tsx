import React from "react";
import SectionHeader from "../section-header";
import { getAllBrandsAction } from "@/app/(dashboard)/brands/action";
import { Brand } from "@/interface/brand";
import { Image } from "antd";

const ProductBrand = async () => {
  const brandsData = await getAllBrandsAction(1, 12);
  const { brands } = brandsData;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const imageBase =
    apiBase?.replace(/\/api\/?$/, "") || "http://localhost:8000";

  return (
    <div>
      <SectionHeader title="Nhãn hiệu tin dùng" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 me-25 ms-30 my-15">
        {brands.map((brand: Brand) => {
          const src = brand.image?.startsWith("http")
            ? brand.image
            : `${imageBase}${brand.image || ""}`;
          return (
            <div
              key={brand._id}
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:border-white/10"
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
