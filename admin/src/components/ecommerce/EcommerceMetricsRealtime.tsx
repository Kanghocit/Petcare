"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EcommerceMetrics } from "./EcommerceMetrics";
import { getSocket } from "@/libs/socket";
import { getStatistics } from "@/libs/statistic";

type EcommerceStats = {
  revenue: number;
  profit: number;
  newCustomers: number;
  sold: number;
  refund: number;
  canceled: number;
};

interface EcommerceMetricsRealtimeProps {
  initialData: EcommerceStats;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export const EcommerceMetricsRealtime: React.FC<
  EcommerceMetricsRealtimeProps
> = ({ initialData, startDate, endDate, type }) => {
  const [data, setData] = useState<EcommerceStats>(initialData);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    const handleOrderUpdated = async () => {
      // Refresh statistics when order is updated
      try {
        const response = await getStatistics(
          startDate || "2025-01-01",
          endDate || "2025-12-31",
          type || "date",
        );
        // Handle both formats: response.stats or response directly
        const newData = response?.stats || response;
        if (newData) {
          setData({
            revenue: newData.revenue || 0,
            profit: newData.profit || 0,
            newCustomers: newData.newCustomers || 0,
            sold: newData.sold || 0,
            refund: newData.refund || 0,
            canceled: newData.canceled || 0,
          });
        }
      } catch (error) {
        console.error("Error refreshing statistics:", error);
        // Fallback: refresh the page to get latest data
        router.refresh();
      }
    };

    socket.on("order-updated", handleOrderUpdated);
    return () => {
      socket.off("order-updated", handleOrderUpdated);
    };
  }, [router, startDate, endDate, type]);

  return <EcommerceMetrics data={data} />;
};

