"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import dayjs from "dayjs";

import { App, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import TablePagination from "../TablePagination";

import Badge from "@/components/ui/badge/Badge";
import { Voicher } from "@/interface/Voicher";

import { deleteVoicherAction } from "@/app/(admin)/(others-pages)/(tables)/manage-voicher-table/action";
import { useRouter } from "next/navigation";
import ModalAddVoicher from "@/app/(admin)/(others-pages)/(tables)/manage-voicher-table/ModalAddVoicher";

export default function ManageVoichersTable({
  voichers,
}: {
  voichers?: { voichers: Voicher[]; total: number };
}) {
  const { voichers: voicherList = [], total = 0 } = voichers || {};
  const { modal, message } = App.useApp();
  const router = useRouter();
  const handleDeleteVoicher = async (id: string) => {
    modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá voucher này không?",
      okText: "Xoá",
      cancelText: "Hủy",
      okType: "danger",
      async onOk() {
        try {
          const res = await deleteVoicherAction(id);
          if (res.ok) {
            message.success("Xoá voucher thành công");
            router.refresh();
          }
        } catch (error) {
          console.error(error);
          message.error("Có lỗi khi xoá voucher");
        }
      },
    });
  };

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
                  Tên voicher
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Voicher code
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Giá trị giảm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ngày bắt đầu
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ngày kết thúc
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Người dùng tối đa
                </TableCell>

                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Số người đã dùng
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
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {voicherList?.map((v) => (
                <TableRow
                  key={v.name}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">{v.name}</div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">{v.code}</div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {v.discountValue}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="line-clamp-1 !max-w-[500px]">
                      {dayjs(v.startDate).format("DD-MM-YYYY")}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {dayjs(v.endDate).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {v.maxUsers}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {v.usedCount ?? 0}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        v.status === "active"
                          ? "success"
                          : v.status === "inactive"
                            ? "warning"
                            : "error"
                      }
                    >
                      {v.status === "active"
                        ? "Đang hoạt động"
                        : v.status === "inactive"
                          ? "Ngừng hoạt động"
                          : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <ModalAddVoicher action="update" initialValues={v}>
                      <Button
                        className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<EditOutlined className="!text-blue-400" />}
                      />
                    </ModalAddVoicher>
                    <Button
                      className="!color-red-500 !border-red-500 hover:!border-red-400 hover:!text-red-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<DeleteOutlined className="!text-red-400" />}
                      onClick={() => handleDeleteVoicher(v._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-voicher-table" />
        </div>
      </div>
    </div>
  );
}
