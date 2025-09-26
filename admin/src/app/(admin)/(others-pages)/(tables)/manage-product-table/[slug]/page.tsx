import React from "react";
import { getProductBySlugAction } from "../action";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductEditForm from "./ProductEditForm";
import { Metadata } from "next";
import { getAllBrandsAction } from "../../manage-brand-table/action";
import { getCategoryAction } from "../../manage-category-table/action";

export const metadata: Metadata = {
  title: "Petcare Admin | Products Detail ",
  description: "Petcare",
  // other metadata
};

const ManageProductDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const [productsData, brandsData, categories] = await Promise.all([
    getProductBySlugAction(slug),
    getAllBrandsAction(1, 20),
    getCategoryAction(),
  ]);

  const product = productsData.product;
  return (
    <>
      <PageBreadcrumb pageTitle="Chỉnh sửa sản phẩm" />
      <div className="space-y-6">
        <ComponentCard title={product?.title || "Chỉnh sửa sản phẩm"}>
          <ProductEditForm
            product={product}
            brands={brandsData}
            categories={categories}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageProductDetail;
