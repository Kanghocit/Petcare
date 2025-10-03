"use client";
import React from "react";
import StatisticCard from "./StatisticCard";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  UndoOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

type EcommerceStats = {
  revenue: number;
  sales: number;
  newCustomers: number;
  sold: number;
  refund: number;
  canceled: number;
};

export const EcommerceMetrics = ({ data }: { data: EcommerceStats }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
      <StatisticCard
        title="Doanh thu"
        value={formatCurrency(data.revenue)}
        icon={
          <DollarOutlined className="text-xl text-emerald-600! dark:text-emerald-500!" />
        }
      />

      <StatisticCard
        title="Doanh số"
        value={formatCurrency(data.sales)}
        icon={
          <ShoppingCartOutlined className="text-xl text-blue-600! dark:text-blue-500!" />
        }
      />

      <StatisticCard
        title="Khách hàng mới"
        value={data.newCustomers}
        icon={
          <UserAddOutlined className="text-xl text-cyan-600! dark:text-cyan-500!" />
        }
      />

      <StatisticCard
        title="Đã bán"
        value={data.sold}
        icon={
          <ShoppingOutlined className="text-xl text-violet-600! dark:text-violet-500!" />
        }
      />

      <StatisticCard
        title="Trả hàng"
        value={data.refund}
        icon={
          <UndoOutlined className="text-xl text-amber-600! dark:text-amber-500!" />
        }
      />

      <StatisticCard
        title="Đã hủy"
        value={data.canceled}
        icon={
          <CloseCircleOutlined className="text-xl text-rose-600! dark:text-rose-500!" />
        }
      />
    </div>
  );
};
