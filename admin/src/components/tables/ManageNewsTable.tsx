'use client'  

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { Button } from "antd";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { approveNewsAction, deleteNewsAction } from "@/action";
import { App } from "antd";
import { useRouter } from "next/navigation";
import NewsArticlePreview from "../news/NewsArticlePreview";
import TablePagination from "./TablePagination";
import { News } from "@/interface/News"

export default function ManageNewsTable({ news }: { news? : {news: News[], total: number} }) {
  console.log('new', news)
  const {news: newsData, total} = news || {};
  
  const {message, modal} = App.useApp();
  const router = useRouter();
  
  const handleDelete = async (slug: string) => {
    modal.confirm({
      title: "Xóa tin tức",
      content: "Bạn có chắc chắn muốn xóa tin tức này không?",
      onOk: async () => {
        const response = await deleteNewsAction(slug);
        if (response.ok) {
          message.success(response.message);
          router.refresh();
        } else {
          message.error(response.message);
        }
      },
    });
  };

  const handleApprove = async (slug: string) => {
    try {
      const response = await approveNewsAction(slug, "active");
      if (response.ok) {  
        message.success('Đã duyệt tin tức');
        router.refresh();
      } else {
        message.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi khi duyệt tin:", error);
      message.error(error.message || "Có lỗi xảy ra khi duyệt tin tức");
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
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tiêu đề
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nội dung
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tác giả
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày đăng
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
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {newsData?.map((news: News) => (
                <TableRow 
                  key={news._id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    // Kiểm tra xem click có phải từ button không
                    const target = e.target as HTMLElement;
                    if (!target.closest('button')) {
                      router.push(`/manage-new-table/${news.slug}`);
                    }
                  }}
                >
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <p className=" line-clamp-1 !max-w-[1/6] font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {news.title}
                    </p>                                  
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                   <p className="line-clamp-1 !max-w-[500px]"> {news.content}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {news.author}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {news.publishTime}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        news.status === "active"
                          ? "success"
                          : news.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {news.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex gap-2 my-3 mx-1">
                    {/* Preview button - chỉ hiển thị cho tin đã duyệt */}  
                      <NewsArticlePreview news={news} />          
                    
                    {/* Approve button - chỉ hiển thị cho tin chờ duyệt */}
                    {news.status === "pending" && (
                      <Button
                        className="!color-green-500 !border-green-500 hover:!text-green-400 hover:!border-green-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<CheckOutlined className="!text-green-400 " />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(news.slug);
                        }}
                      />
                    )}

                    {/* Delete button */}
                    <Button                    
                      size="small"
                      shape="circle"
                      color="danger"
                      variant="outlined"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(news.slug);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-new-table" />
        </div>
      </div>
    </div>
  );
}
