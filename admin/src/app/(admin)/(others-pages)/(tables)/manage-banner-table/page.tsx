import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageBannerTable from "@/components/tables/ManageBannerTable";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import ModalAddBanner from "./ModalAddBanner";
import { Metadata } from "next";

import { getAllBannersAction } from "./action";

export const metadata: Metadata = {
  title: "Kangdy Admin | Banner ",
  description: "Kangdy",
  // other metadata
};
const ManageBannerTablePage = async () => {
  const bannersData = await getAllBannersAction();

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý banner" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý banner"
          subHeader={
            <>
              <ModalAddBanner>
                <Button
                  variant="outlined"
                  color="primary"
                  icon={<PlusOutlined />}
                >
                  Thêm
                </Button>
              </ModalAddBanner>
            </>
          }
        >
          <ManageBannerTable banners={bannersData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageBannerTablePage;
