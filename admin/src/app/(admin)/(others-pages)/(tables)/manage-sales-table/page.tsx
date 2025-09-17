import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

import { Metadata } from "next";
import ManageSalesTable from "@/components/tables/ManageSalesTable";
import { getFlashSaleAction } from "./action";
import ButtonChangeRouter from "./ButtonChangeRouter";

export const metadata: Metadata = {
  title: "Petcare Admin | Flash Sale ",
  description: "Petcare",
  // other metadata
};
const ManageSalesTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; search: string; limit: number }>;
}) => {
  const { page, search, limit } = await searchParams;
  const flashSalesData = await getFlashSaleAction(page, limit, search);

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý chương trình khuyến mại" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý chương trình khuyến mại"
          subHeader={
            <>
              <ButtonChangeRouter action={"add"} />
            </>
          }
        >
          <ManageSalesTable flashSales={flashSalesData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageSalesTablePage;
