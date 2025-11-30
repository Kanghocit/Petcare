import React from "react";
import BreadCumb from "@/components/breadCrumb";
import ProductsFilter from "./components/products-filter";
import Products from "@/components/products";
import ProductCard from "@/components/product-card";
import { getProductsAction, searchProductAction } from "./action";
import { Product } from "../../../interface/product";
import TablePagination from "@/components/table-pagination";
import { getAllBrandsAction } from "../brands/action";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// Revalidate products page every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = createMetadata({
  title: "Sản phẩm",
  description:
    "Khám phá bộ sưu tập sản phẩm đa dạng cho thú cưng tại Kangdy PetShop. Thức ăn, đồ chơi, phụ kiện chất lượng cao.",
});

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: number | 1;
    search?: string | "";
    brand?: string | string[];
    color?: string | string[];
    status?: string | string[];
    price_min?: string;
    price_max?: string;
    isNewProduct?: string;
    isSaleProduct?: string;
    bestSelling?: string;
  }>;
}) => {
  const params = await searchParams;
  const { page, search, q } = await searchParams;

  // Build extra query with repeated keys
  const buildExtras = () => {
    const extras = new URLSearchParams();
    const appendMulti = (key: "brand" | "color" | "status") => {
      const value = params[key];
      if (!value) return;
      const arr = Array.isArray(value) ? value : [value];
      arr.forEach((v) => extras.append(key, v));
    };
    appendMulti("brand");
    appendMulti("color");
    appendMulti("status");

    if (params.price_min) extras.set("price_min", String(params.price_min));
    if (params.price_max) extras.set("price_max", String(params.price_max));

    if (params.isNewProduct) extras.set("isNewProduct", "1");
    if (params.isSaleProduct) extras.set("isSaleProduct", "1");
    if (params.bestSelling) extras.set("bestSelling", "1");

    return extras.toString();
  };

  const [productsResult, brands] = await Promise.all([
    q
      ? searchProductAction(q, Number(page ?? 1), 18)
      : getProductsAction(Number(page ?? 1), search ?? "", 12, buildExtras()),
    getAllBrandsAction(1, 10),
  ]);

  // Xử lý trường hợp lỗi hoặc không tìm thấy
  const products = productsResult || { products: [], total: 0, message: "" };

  return (
    <>
      <div className="p-4 flex flex-col gap-4 max-w-screen-2xl mx-auto">
        <BreadCumb />
        <div className="flex gap-4 mx-4">
          <div className="w-1/4">
            <ProductsFilter brands={brands.brands} />
          </div>
          <div className="w-3/4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            {/* Hiển thị thông báo nếu có message và không có sản phẩm */}
            {products.message && products.products?.length === 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">{products.message}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              {products?.products?.map((product: Product) => (
                <ProductCard
                  id={String(product._id)}
                  slug={product.slug}
                  key={product.slug}
                  title={product.title}
                  star={product.star}
                  price={product.price}
                  isSale={product.isSaleProduct}
                  discount={product.discount}
                  salePrice={product.price * (1 - product.discount / 100)}
                  isNew={product.isNewProduct}
                  img={[product.images[0], product.images[1]]}
                />
              ))}
              {products?.products?.length === 0 && !products.message && (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-2xl font-bold">
                    Sản phẩm hiện đang trống
                  </h1>
                </div>
              )}
            </div>
            <TablePagination total={products?.total || 0} link="/products" />
          </div>
        </div>
      </div>
      <Products />
    </>
  );
};

export default ProductsPage;
