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
import { EditOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Banner } from "@/interface/Banner";

const ModalAddBanner = dynamic(
  () =>
    import(
      "@/app/(admin)/(others-pages)/(tables)/manage-banner-table/ModalAddBanner"
    ),
  {
    ssr: false,
  },
);

export default function ManageBannerTable({
  banners,
}: {
  banners?: { banners: Banner[] };
}) {
  const { banners: bannerList = [] } = banners || {};
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
                  Ảnh
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Tên banner
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Thứ tự
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
              {bannerList?.map((b) => (
                <TableRow
                  key={b.title}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm w-1/4 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">
                      {(() => {
                        const rewriteBannerPath = (u?: string) => {
                          if (!u) return u;
                          // Replace /images/banner/... with /images/hero/... to bypass ad-blockers
                          return u.replace(
                            /(^|\/)images\/banner\//,
                            "$1images/hero/",
                          );
                        };
                        const raw = b.image;
                        const normalized = rewriteBannerPath(raw);
                        const src = normalized?.startsWith("http")
                          ? normalized
                          : `${imageBase}${normalized}`;

                        return b.image ? (
                          <Image
                            width={180}
                            src={src as string}
                            alt=""
                            className="rounded-sm"
                          />
                        ) : (
                          <span>--</span>
                        );
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm !max-w-[250px] px-4 py-3 text-start text-gray-500 hover:!max-w-full dark:text-gray-400">
                    {b.title}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {b.sort}
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <ModalAddBanner initialValues={b} action="update">
                      <Button
                        size="small"
                        shape="circle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                      />
                    </ModalAddBanner>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Banners typically are few; omit pagination or compute total if needed */}
        </div>
      </div>
    </div>
  );
}
