import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageCommentTable from "@/components/tables/ManageCommentTable";

import React from "react";
import { Metadata } from "next";
import { getCommentsInAdminAction } from "./action";

export const metadata: Metadata = {
  title: "Petcare Admin | Comment",
  description: "Petcare",
};

const ManageCommentTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
  const { page, limit } = await searchParams;
  const commentsData = await getCommentsInAdminAction(
    Number(page) || 1,
    Number(limit) || 10,
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý đánh giá" />
      <div className="space-y-6">
        <ComponentCard title="Quản lý đánh giá">
          <ManageCommentTable comments={commentsData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageCommentTablePage;
