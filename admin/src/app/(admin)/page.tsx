import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { getStatisticsAction } from "../action";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Ecommerce({
  searchParams,
}: {
  searchParams: Promise<{ startDate: string; endDate: string; type: string }>;
}) {
  const { startDate, endDate, type } = await searchParams;

  const statisticData = await getStatisticsAction(startDate, endDate, type);
  const { products, chart } = statisticData;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <MonthlySalesChart chart={chart} />
      </div>
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics data={statisticData} />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentOrders
          title="Sản phẩm sắp hết hàng"
          products={products?.lowStock || []}
        />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentOrders
          title="Sản phẩm hết hàng"
          products={products?.outOfStock || []}
        />
      </div>
    </div>
  );
}
