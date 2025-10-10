"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

import { Button, Avatar, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Customer } from "@/interface/Customer";
import TablePagination from "../TablePagination";
import clsx from "clsx";

import { useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";

export default function ManageStaffTable({
    staffs,
}: {
    staffs?: { users: Customer[]; total: number };
}) {
    const { users: staffList = [], total = 0 } = staffs || {};
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
                                    Họ và tên
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Tài khoản
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Email
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
                                    Ngày tạo
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
                            {staffList?.map((u) => (
                                <TableRow
                                    key={u._id}
                                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                >
                                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 hover:!max-w-fit dark:text-gray-400">
                                        <Tooltip title={u.name}>
                                            <p
                                                className={clsx(
                                                    "text-theme-sm line-clamp-1 font-medium text-gray-800 hover:!max-w-full dark:text-white/90",
                                                )}
                                            >
                                                {u.name}
                                            </p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Avatar size={32} src={u.avatar}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">{u.username || "--"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                                        {u.email}
                                    </TableCell>
                                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                u.status === "active"
                                                    ? "success"
                                                    : u.status === "inactive"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {u.status === "active"
                                                ? "Hoạt động"
                                                : u.status === "inactive"
                                                    ? "Tạm dừng"
                                                    : ""}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                                        <Button
                                            className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                                            size="small"
                                            shape="circle"
                                            variant="outlined"
                                            icon={<EyeOutlined className="!text-blue-400" />}
                                            onClick={() => router.push(`/manage-staff-table/${u._id}`)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination total={total || 0} link="/manage-staff-table" />
                </div>
            </div>
        </div>
    );
}
