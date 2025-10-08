import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

import { Metadata } from "next";

import { getAllAddressAction } from "./action";
import ModalAddAddress from "./ModalAddAddress";
import ManageAddressTable from "@/components/tables/ManageAddressesTable";

export const metadata: Metadata = {
  title: "Kangdy Admin | Address ",
  description: "Kangdy",
  // other metadata
};

const ManageAddressTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; limit: string }>;
}) => {
  const { page, limit } = await searchParams;
  const addressesData = await getAllAddressAction(
    Number(page) || 1,
    Number(limit) || 10,
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý địa chỉ" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý địa chỉ"
          subHeader={
            <>
              <ModalAddAddress>
                <Button
                  variant="outlined"
                  color="primary"
                  icon={<PlusOutlined />}
                >
                  Thêm
                </Button>
              </ModalAddAddress>
            </>
          }
        >
          <ManageAddressTable addresses={addressesData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageAddressTablePage;
