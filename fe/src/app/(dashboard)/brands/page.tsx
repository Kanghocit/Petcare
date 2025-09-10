import Breadcrumb from "@/components/breadCrumb";
import BrandCarousel from "@/components/brands/BrandCarousel";

import BrandFilter from "@/components/brands/BrandFilter";
import { getAllBrandsAction } from "./action";

const BrandsPage = async () => {
  const data = await getAllBrandsAction();
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
