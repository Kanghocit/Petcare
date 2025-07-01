import React from "react";
import BreadCumb from "@/components/breadCrumb";
import ProductsFilter from "./components/products-filter";
import Products from "@/components/products";
import ProductCard from "@/components/product-card";
const ProductsPage = () => {
  return (
    <>
      <div className="p-4 flex flex-col gap-4 max-w-screen-2xl mx-auto">
        <BreadCumb />
        <div className="flex gap-4">
          <div className="w-1/4">
            <ProductsFilter />
          </div>
          <div className="w-3/4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            <ProductCard title="Sản phẩm 1" star={5} price={100000} />
            {/* Thêm nội dung trang sản phẩm ở đây */}
            hehehe
          </div>
        </div>
      </div>
      <Products />
    </>
  );
};

export default ProductsPage;
