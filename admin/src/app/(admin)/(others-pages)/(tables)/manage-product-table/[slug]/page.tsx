import React from "react";
import { getProductBySlugAction } from "../action";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductEditForm from "./ProductEditForm";
import { Metadata } from "next";

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
  const data = await getProductBySlugAction(slug);
  const product = data.product;
  return (
    <>
      <PageBreadcrumb pageTitle="Chỉnh sửa sản phẩm" />
      <div className="space-y-6">
        <ComponentCard title={product?.title || "Chỉnh sửa sản phẩm"}>
          <ProductEditForm product={product} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageProductDetail;
