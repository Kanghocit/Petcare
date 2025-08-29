import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import React from "react";
// import ModalAddProduct from "./ModalAddProduct";
import { Metadata } from "next";
import ManageVoichersTable from "@/components/tables/ManageVoichersTable";
import { getAllVoichersAction } from "./action";
import SearchVoicher from "./SearchVoicher";
import ModalAddVoicher from "./ModalAddVoicher";
// import { getAllProductsAction } from "./action";
// import SearchProducts from "./SearchProducts";

export const metadata: Metadata = {
  title: "Petcare Admin | Products ",
  description: "Petcare",
  // other metadata
};

const ManageVoicherTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; search: string }>;
}) => {
  const { page, search } = await searchParams;
  const voichersData = await getAllVoichersAction(page, search);
  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách voichers" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lí voichers"
          subHeader={
            <div className="flex items-center justify-between gap-2">
              <ModalAddVoicher />
              <SearchVoicher />
            </div>
          }
        >
          <ManageVoichersTable voichers={voichersData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageVoicherTablePage;
