import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageBrandTable from "@/components/tables/ManageBrandTable";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

import { Metadata } from "next";

import { getAllBrandsAction } from "./action";
import ModalAddBrand from "./ModalAddBrand";

export const metadata: Metadata = {
  title: "Kangdy Admin | Brand ",
  description: "Kangdy",
  // other metadata
};
const ManageBannerTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; limit: string }>;
}) => {
  const { page, limit } = await searchParams;
  const brandsData = await getAllBrandsAction(
    Number(page) || 1,
    Number(limit) || 5,
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý brand" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý brand"
          subHeader={
            <>
              <ModalAddBrand>
                <Button
                  variant="outlined"
                  color="primary"
                  icon={<PlusOutlined />}
                >
                  Thêm
                </Button>
              </ModalAddBrand>
            </>
          }
        >
          <ManageBrandTable brands={brandsData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageBannerTablePage;
