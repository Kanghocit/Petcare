import React from "react";
import BreadCumb from "@/components/breadCrumb";
import ProductsFilter from "./components/products-filter";
import Products from "@/components/products";
import ProductCard from "@/components/product-card";
import { getProductsAction } from "./action";
import { Product } from "../../../interface/product";
import TablePagination from "@/components/table-pagination";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: number | 1; search?: string | "" }>;
}) => {
  const { page, search } = await searchParams;
  const products = await getProductsAction(Number(page ?? 1), search ?? "");

  console.log("products", products);
  return (
    <>
      <div className="p-4 flex flex-col gap-4 max-w-screen-2xl mx-auto">
        <BreadCumb />
        <div className="flex gap-4 mx-4">
          <div className="w-1/4">
            <ProductsFilter />
          </div>
          <div className="w-3/4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
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
            </div>
            <TablePagination total={products?.total} link="/products" />
          </div>
        </div>
      </div>
      <Products />
    </>
  );
};

export default ProductsPage;
