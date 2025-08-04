"use client";

import NewPostCard from "@/components/news/NewPostCard";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  publishTime: string;
  slug: string;
}

const NewsTable = ({
  data,
  totalPages,
}: {
  data: News[];
  totalPages: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");

  // Tính tổng số items (totalPages * pageSize)
  const totalItems = totalPages * pageSize;

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6">
          {data?.map((item: News) => (
            <NewPostCard isCard={false} key={item._id} data={item as News} />
          ))}
        </div>
        <div className="flex items-center justify-center w-full">
          <Pagination
            total={totalItems}
            pageSize={pageSize}
            current={currentPage}
            onChange={(page, size) => {
              router.push(`/news?page=${page}&limit=${size}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsTable;
