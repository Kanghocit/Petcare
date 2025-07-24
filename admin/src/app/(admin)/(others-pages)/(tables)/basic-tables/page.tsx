import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Petcare Admin ",
  description: "Petcare",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Quản lí bài đăng" />
      <div className="space-y-6">
        <ComponentCard title="Bài đăng">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
