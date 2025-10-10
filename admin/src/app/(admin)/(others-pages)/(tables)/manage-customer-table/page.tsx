import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageCustomerTable from '@/components/tables/ManageCustomerTable'
import { Metadata } from "next";
import React from "react";
import { GetAllUsersAction } from "./action";

export const metadata: Metadata = {
  title: "Kangdy Admin ",
  description: "Kangdy",
  // other metadata
};

export default async function ManageCustomerTablePage({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  const { page } = await searchParams;
  const usersData = await GetAllUsersAction("user", Number(page));

  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách khách hàng" />
      <div className="space-y-6">
        <ComponentCard title="Quản lí khách hàng">
          <ManageCustomerTable customer={usersData} />
        </ComponentCard>
      </div>
    </div>
  );
}
