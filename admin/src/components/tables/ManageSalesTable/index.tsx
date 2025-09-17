"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import {
  deleteFlashSaleAction,
  toggleFlashSaleStatusAction,
} from "@/app/(admin)/(others-pages)/(tables)/manage-sales-table/action";
import { App } from "antd";
import { useRouter } from "next/navigation";
import TablePagination from "../TablePagination";
import { FlashSale } from "@/interface/FlashSales";
import { Switch, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ManageSalesTable({
  flashSales,
}: {
  flashSales?: { flashSales: FlashSale[]; total: number };
}) {
  const flashSalesData = flashSales?.flashSales || [];
  const total = flashSales?.total || 0;

  const { message, modal } = App.useApp();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    modal.confirm({
      title: "Xóa chương trình khuyến mại",
      content: "Bạn có chắc chắn muốn xóa chương trình khuyến mại này không?",
      onOk: async () => {
        const response = await deleteFlashSaleAction(id);
        if (response.ok) {
          message.success(response.message);
          router.refresh();
        } else {
          message.error(response.message);
        }
      },
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await toggleFlashSaleStatusAction(id, newStatus);
      if (response.ok) {
        message.success("Đã cập nhật trạng thái");
        router.refresh();
      } else {
        message.error(response.message);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error(
        (error as Error).message || "Có lỗi xảy ra khi cập nhật trạng thái",
      );
    }
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
                  Tên khuyến mại
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
                  Loại khuyến mãi
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
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {flashSalesData.map((item: FlashSale) => (
                <TableRow
                  key={item._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    // Kiểm tra xem click có phải từ button không
                    const target = e.target as HTMLElement;
                    if (!target.closest("button")) {
                      router.push(`/manage-sales-table/edit?id=${item._id}`);
                    }
                  }}
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {item.name}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {dayjs(item.startDate).format("DD/MM/YYYY")}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {dayjs(item.endDate).format("DD/MM/YYYY")}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {item.discountType === "fixed"
                        ? "Giảm giá cố định"
                        : "Giảm giá phần trăm"}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Switch
                      checked={item.status === "active"}
                      onChange={() =>
                        handleToggleStatus(item._id!, item.status || "inactive")
                      }
                    />
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        color="danger"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id!);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-sales-table" />
        </div>
      </div>
    </div>
  );
}
