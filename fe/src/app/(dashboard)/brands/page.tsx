import Breadcrumb from "@/components/breadCrumb";
import BrandCarousel from "@/components/brands/BrandCarousel";

import BrandFilter from "@/components/brands/BrandFilter";
import { getAllBrandsAction } from "./action";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// Revalidate brands page every 1 hour
export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Thương hiệu",
  description: "Khám phá các thương hiệu uy tín tại Kangdy PetShop. Sản phẩm chất lượng cao từ các nhà sản xuất hàng đầu.",
});

const BrandsPage = async () => {
  const data = await getAllBrandsAction(1, 20);
  const { brands } = data;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb />

        <div className="mx-4">
          {/* Brand Carousel */}
          <div className="mt-8 mb-12">
            <BrandCarousel brands={brands} />
          </div>

          <BrandFilter />
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
