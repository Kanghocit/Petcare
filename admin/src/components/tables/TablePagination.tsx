"use client";

import React, { useState } from "react";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const TablePagination: React.FC<{
  total: number;
  link: string;
  limit?: number;
}> = ({ total, link, limit }) => {
  const [current, setCurrent] = useState(1);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();

  const onChange: PaginationProps["onChange"] = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    // Use the provided link or fallback to current pathname
    const baseUrl = link || pathname;
    router.push(`${baseUrl}?${params.toString()}`);
    setCurrent(page);
  };

  return (
    <div className="my-4 flex justify-center">
      <Pagination
        current={current}
        onChange={onChange}
        total={total}
        pageSize={limit}
      />
    </div>
  );
};

export default TablePagination;
