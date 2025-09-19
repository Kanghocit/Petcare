import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageProductsTable from "@/components/tables/ManageProductsTable";
import React from "react";
import ModalAddProduct from "./ModalAddProduct";
import { Metadata } from "next";
import { getAllProductsAction } from "./action";
import SearchProducts from "./SearchProducts";
import { getAllBrandsAction } from "../manage-brand-table/action";

export const metadata: Metadata = {
  title: "Petcare Admin | Products ",
  description: "Petcare",
  // other metadata
};

const ManageProductTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; search: string }>;
}) => {
  const { page, search } = await searchParams;
  const [productsData, brandsData] = await Promise.all([
    getAllProductsAction(page, search),
    getAllBrandsAction(page, 20),
  ]);

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách sản phẩm" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lí sản phẩm"
          subHeader={
            <div className="flex items-center justify-between gap-2">
              <ModalAddProduct brands={brandsData} />
              <SearchProducts />
            </div>
          }
        >
          <ManageProductsTable products={productsData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageProductTablePage;
