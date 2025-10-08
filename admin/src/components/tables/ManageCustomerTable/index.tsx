'use client'

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { Button } from "antd";
import { EditOutlined, UnlockOutlined, LockOutlined } from "@ant-design/icons";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { Customer } from "@/interface/Customer";
import dayjs from "dayjs";
import TablePagination from "../TablePagination";
import { UpdateUserAction } from "@/app/(admin)/(others-pages)/(tables)/manage-customer-table/action";
import dynamic from "next/dynamic";
import { CustomerAddress } from "@/interface/Address";

const NoteModal = dynamic(
  () => import('./NoteModal'),
  {
    ssr: false,
  },
)

export default function ManageCustomerTable({ customer }: { customer?: { users: Customer[], total: number } }) {
  const { users: customers, total } = customer || {}

  console.log('customers', customers);

  const { message, modal } = App.useApp();
  const router = useRouter();

  const getDefaultAddressName = (address?: CustomerAddress[] | CustomerAddress | null) => {
    if (Array.isArray(address)) {
      return address.find((item: CustomerAddress) => item.isDefault)?.name;
    }
    return address?.name;
  }

  const handleDisableUser = async (id: string) => {
    modal.confirm({
      title: "Vô hiệu hóa khách hàng",
      content: "Bạn có chắc chắn muốn vô hiệu hóa khách hàng này không?",
      onOk: async () => {
        const response = await UpdateUserAction(id, { status: "blocked" })
        if (response.ok) {
          message.success(response.message);
          router.refresh();
        } else {
          message.error(response.message);
        }
      },
    });
  };
  const handleActiveUser = async (id: string) => {
    modal.confirm({
      title: "Kích hoạt hóa khách hàng",
      content: "Bạn có chắc chắn muốn kích hoạt hóa khách hàng này không?",
      onOk: async () => {
        const response = await UpdateUserAction(id, { status: "active" })
        if (response.ok) {
          message.success("Đã kích hoạt hóa tài khoản");
          router.refresh();
        } else {
          message.error(response.message);
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
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Họ và tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Số điện thoại
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Địa chỉ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày tạo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tổng chi tiêu (VNĐ)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Hạng khách hàng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ghi chú nội bộ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {customers?.map((u) => (
                <TableRow
                  key={u._id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    // Kiểm tra xem click có phải từ button không
                    const target = e.target as HTMLElement;
                    if (!target.closest('button')) {
                      router.push(`/manage-customer-table/${u._id}`);
                    }
                  }}
                >
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <p className=" line-clamp-1 !max-w-[1/6] font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {u.name}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <p className="line-clamp-1 !max-w-[500px]"> {u.phone || "--"}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {getDefaultAddressName(u?.address) || "--"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {dayjs(u.createdAt).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={u.status === "active" ? "success" : u.status === "blocked" ? "warning" : "error"}
                    >
                      {u.status ?? "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {u.total_spend ?? "--"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={u.rank === "new" ? "primary" : u.rank === "regular" ? "info" : u.rank === "loyal" ? "warning" : "success"}
                    >
                      {u.rank ?? "new"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {u.note || "--"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex gap-2 my-3 mx-1">
                    {/* Update button */}
                    <NoteModal id={u._id}>
                      <Button
                        size="small"
                        shape="circle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                      />
                    </NoteModal>

                    {/* Disable user button - chỉ hiển thị cho tin chờ duyệt */}
                    {u.status === "blocked" ? (
                      <Button
                        className="!color-yellow-500 !border-yellow-500 hover:!text-yellow-400 hover:!border-yellow-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<UnlockOutlined className="!text-yellow-400 " />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActiveUser(u._id);
                        }}
                      />
                    ) : (
                      <Button
                        className="!color-red-500 !border-red-500 hover:!text-red-400 hover:!border-red-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<LockOutlined className="!text-red-400 " />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisableUser(u._id);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-customer-table" />
        </div>
      </div>
    </div>
  );
}
