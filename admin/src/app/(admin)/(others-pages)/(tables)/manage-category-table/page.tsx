import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import ModalAddCategory from "./ModalAddCategory";
import SearchCategory from "./SearchCategory";
import ManageCategoryTable from "@/components/tables/ManageCategoryTable";
import { getCategoryAction } from "./action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petcare Admin | Category ",
  description: "Petcare",
  // other metadata
};

const ManageCategoryTablePage = async () => {
  const categories = await getCategoryAction();
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý danh mục" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý danh mục"
          subHeader={
            <div className="flex items-center justify-between gap-2">
              <ModalAddCategory categories={categories?.categories || []} />
              <SearchCategory />
            </div>
          }
        >
          <ManageCategoryTable categories={categories?.categories || []} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageCategoryTablePage;
