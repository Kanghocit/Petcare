import React from "react";
import SectionHeader from "../section-header";
import { BRANDS } from "@/constants/brand";
const ProductBrand = () => {
  return (
    <div>
      <SectionHeader title="Nhãn hiệu tin dùng" />
      <div className="flex flex-wrap gap-4 justify-around items-center me-25 ms-30 my-15">
        {BRANDS.map((brand) => (
          <div key={brand.id}>
            <img
              src={brand.img}
              alt={brand.name}
              className="w-30 h-20 object-cover transition-transform duration-300 transform hover:scale-110 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBrand;
