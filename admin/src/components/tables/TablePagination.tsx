"use client";

import React, { useState } from "react";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";

const TablePagination: React.FC<{
  total: number;
  link: string;
  limit?: number;
}> = ({ total, link, limit }) => {
  const [current, setCurrent] = useState(1);
  const router = useRouter();

  const onChange: PaginationProps["onChange"] = (page) => {
    router.push(`${link}?page=${page}&limit=${limit}`);
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
