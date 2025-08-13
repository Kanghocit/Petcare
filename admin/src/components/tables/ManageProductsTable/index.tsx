"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Button, Image } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Product } from "@/interface/Products";
import TablePagination from "../TablePagination";
import clsx from "clsx";

import dynamic from "next/dynamic";

const ModalAddProduct = dynamic(
  () =>
    import(
      "@/app/(admin)/(others-pages)/(tables)/manage-product-table/ModalAddProduct"
    ),
  {
    ssr: false,
  },
);

export default function ManageProductsTable({
  products,
}: {
  products?: { products: Product[]; total: number };
}) {
  const { products: productList = [], total = 0 } = products || {};
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const imageBase = apiBase?.replace(/\/api\/?$/, "");

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
                  // onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                  //   const target = e.target as HTMLElement;
                  //   if (
                  //     !target.closest("button") &&
                  //     !target.closest(".ant-modal") &&
                  //     !target.closest(".ant-upload")
                  //   ) {
                  //     router.push(`/manage-product-table/${p.slug}`);
                  //   }
                  // }}
                >
                  <TableCell className="text-theme-sm !max-w-[250px] px-4 py-3 text-start text-gray-500 hover:!max-w-full dark:text-gray-400">
                    <p
                      className={clsx(
                        "text-theme-sm line-clamp-2 font-medium text-gray-800 dark:text-white/90",
                        p.quantity < 20 && "text-red-500",
                      )}
                    >
                      {p.title}
                    </p>
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
                    <p className="line-clamp-1 !max-w-[500px]">
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
                        p.quantity < 20 && "text-red-500",
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
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.star}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {p.brand || "--"}
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <ModalAddProduct initialValues={p} action="update">
                      <Button
                        size="small"
                        shape="circle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                      />
                    </ModalAddProduct>
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
