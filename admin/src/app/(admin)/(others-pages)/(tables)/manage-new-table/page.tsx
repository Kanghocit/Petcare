import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageNewsTable from "@/components/tables/ManageNewsTable";
import { getAllNewsAction } from "@/action";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Petcare Admin ",
  description: "Petcare",
  // other metadata
};

export default async function ManageNewsTablePage({searchParams}: {searchParams: Promise<{page: string}>}) {
  const {page} = await searchParams;
  const newsData = await getAllNewsAction(Number(page));
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Quản lí bài đăng" />
      <div className="space-y-6">
        <ComponentCard title="Bài đăng">
          <ManageNewsTable news={newsData} />
        </ComponentCard>
      </div>
    </div>
  );
}
