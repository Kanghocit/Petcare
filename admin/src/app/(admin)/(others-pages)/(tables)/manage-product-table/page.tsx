import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageProductsTable from "@/components/tables/ManageProductsTable";
import React from "react";
import ModalAddProduct from "./ModalAddProduct";
import { Metadata } from "next";
import { getAllProductsAction } from "./action";

export const metadata: Metadata = {
  title: "Petcare Admin ",
  description: "Petcare",
  // other metadata
};

const ManageProductTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await searchParams;
  const productsData = await getAllProductsAction(page);

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách sản phẩm" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lí sản phẩm"
          subHeader={
            <>
              <ModalAddProduct />
            </>
          }
        >
          <ManageProductsTable products={productsData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageProductTablePage;
