"use client";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { updateOrderStatusAction } from "../action";
import { FulfillmentInfo } from "@/interface/Orders";

type ActionMode = "status" | "rejectReturn";

const OrderAction = ({
  id,
  fulfillment,
  hasReturnRequest,
}: {
  id: string;
  fulfillment: FulfillmentInfo["status"];
  hasReturnRequest?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const actionsByStatus: Record<
    FulfillmentInfo["status"],
    {
      label: string;
      next?: FulfillmentInfo["status"];
      color?: "primary" | "danger";
      icon: React.ReactNode;
      mode?: ActionMode;
    }[]
  > = {
    unfulfilled: [
      {
        label: "Bắt đầu xử lý",
        next: "processing",
        color: "primary",
        icon: <CheckOutlined />,
      },
      {
        label: "Hủy",
        next: "cancelled",
        color: "danger",
        icon: <CloseOutlined />,
      },
    ],
    processing: [
      {
        label: "Bắt đầu giao",
        next: "shipping",
        color: "primary",
        icon: <CheckOutlined />,
      },
      {
        label: "Hủy",
        next: "cancelled",
        color: "danger",
        icon: <CloseOutlined />,
      },
    ],
    shipping: [
      {
        label: "Đã giao",
        next: "shipped",
        color: "primary",
        icon: <CheckOutlined />,
      },
    ],
    shipped: [
      {
        label: "Đã giao (Đã nhận)",
        next: "delivered",
        color: "primary",
        icon: <CheckOutlined />,
      },
    ],
    delivered: [
      {
        // Admin chấp nhận yêu cầu hoàn hàng -> chuyển trạng thái sang returned
        label: "Chấp nhận yêu cầu hoàn hàng",
        next: "returned",
        color: "primary",
        icon: <CheckOutlined />,
        mode: "status",
      },
      {
        // Admin từ chối yêu cầu hoàn hàng -> giữ nguyên trạng thái, chỉ ghi chú
        label: "Từ chối yêu cầu hoàn hàng",
        color: "danger",
        icon: <CloseOutlined />,
        mode: "rejectReturn",
      },
    ],
    returned: [],
    cancelled: [
      {
        label: "Quay về chưa xử lý",
        next: "unfulfilled",
        color: "danger",
        icon: <CloseOutlined />,
      },
    ],
  };

  let actions = actionsByStatus[fulfillment] || [];

  // Chỉ hiển thị các nút xử lý hoàn hàng nếu đã có yêu cầu từ phía user
  if (fulfillment === "delivered" && !hasReturnRequest) {
    actions = [];
  }

  const handleClick = async (action: {
    next?: FulfillmentInfo["status"];
    mode?: ActionMode;
  }) => {
    try {
      setIsLoading(true);

      if (action.mode === "rejectReturn") {
        // Chỉ cập nhật ghi chú, giữ nguyên trạng thái delivered
        await updateOrderStatusAction(id, {
          note: "[RETURN_REJECTED] Yêu cầu hoàn hàng đã bị từ chối bởi admin.",
        });
      } else if (action.next) {
        await updateOrderStatusAction(id, { fulfillmentStatus: action.next });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (actions.length === 0) return null;

  return (
    <div className="mb-4 flex">
      {actions.map((a) => (
        <Button
          key={a.label}
          variant="outlined"
          color={a.color}
          icon={a.icon}
          className="mr-2"
          onClick={() => handleClick(a)}
          loading={isLoading}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
};

export default OrderAction;
