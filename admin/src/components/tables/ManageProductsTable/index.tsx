"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Button, Image, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Product } from "@/interface/Products";
import TablePagination from "../TablePagination";
import clsx from "clsx";

import { useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";

export default function ManageProductsTable({
  products,
}: {
  products?: { products: Product[]; total: number };
}) {
  const { products: productList = [], total = 0 } = products || {};
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const imageBase = apiBase?.replace(/\/api\/?$/, "");
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Tên sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ảnh sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Số lượng
                </TableCell>

                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Là sản phẩm mới
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Đang giảm giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Giảm giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Số sao
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Hãng
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {productList?.map((p) => (
                <TableRow
                  key={p.title}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 hover:!max-w-fit dark:text-gray-400">
                    <Tooltip title={p.title}>
                      <p
                        className={clsx(
                          "text-theme-sm line-clamp-1 font-medium text-gray-800 hover:!max-w-full dark:text-white/90",
                          p.quantity < 10 && "text-red-500",
                        )}
                      >
                        {p.title}
                      </p>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">
                      {p.images?.map((item, index) => {
                        const src = item.startsWith("http")
                          ? item
                          : `${imageBase}${item}`;
                        return (
                          <Image
                            width={40}
                            src={src}
                            key={index}
                            alt=""
                            className="rounded-sm"
                          />
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="line-clamp-1 !max-w-[300px]">
                      {p.description || "--"}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.price}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p
                      className={clsx(
                        "text-theme-sm line-clamp-2 font-medium text-gray-800 dark:text-white/90",
                        p.quantity < 10 && "text-red-500",
                      )}
                    >
                      {p.quantity === 0 ? "Hết hàng" : p.quantity}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.isNewProduct ? (
                      <CheckCircleOutlined className="ms-2 text-xl !text-green-500" />
                    ) : (
                      <CloseCircleOutlined className="ms-2 text-xl !text-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.isSaleProduct ? (
                      <CheckCircleOutlined className="ms-2 text-xl !text-blue-500" />
                    ) : (
                      <CloseCircleOutlined className="ms-2 text-xl !text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.discount}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start whitespace-nowrap text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        p.status === "active"
                          ? "success"
                          : p.status === "inactive"
                            ? "warning"
                            : "error"
                      }
                    >
                      {p.status === "active"
                        ? "Đang bán"
                        : p.status === "inactive"
                          ? "Tạm ngừng bán"
                          : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.star}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.brand || "--"}
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <Button
                      className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<EyeOutlined className="!text-blue-400" />}
                      onClick={() =>
                        router.push(`/manage-product-table/${p.slug}`)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-product-table" />
        </div>
      </div>
    </div>
  );
}
