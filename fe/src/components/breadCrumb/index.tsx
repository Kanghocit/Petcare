"use client";

import React from "react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

const BreadCrumb: React.FC<{ title?: string }> = ({ title }) => {
  const pathname = usePathname();

  // Hàm chuyển đổi segment thành tên tiếng Việt
  const getSegmentTitle = (segment: string) => {
    const titleMap: { [key: string]: string } = {
      products: "Tất cả sản phẩm",
      services: "Dịch vụ",
      orders: "Đơn hàng",
      profile: "Tài khoản",
      contact: "Liên hệ",
      news: "Tạp chí chăm Boss",
      checkout: "Đặt mua",
      brands: "Nhãn hiệu",
      payment: "Thanh toán",
      // Thêm các mapping khác ở đây
    };

    return (
      titleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  // Tách path thành các phần
  const pathSegments = pathname.split("/").filter(Boolean);

  // Tạo items cho Breadcrumb
  const items = [
    {
      title: "Trang chủ",
      href: "/",
    },
    ...pathSegments.map((segment, index) => {
      const isLast = index === pathSegments.length - 1;

      return {
        title: isLast && title ? title : getSegmentTitle(segment),
        href: `/${pathSegments.slice(0, index + 1).join("/")}`,
      };
    }),
  ];

  return (
    <div className="flex gap-4 bg-[#f4f4f4] p-4 rounded-md mx-4 shadow-sm">
      <Breadcrumb items={items} />
    </div>
  );
};

export default BreadCrumb;
