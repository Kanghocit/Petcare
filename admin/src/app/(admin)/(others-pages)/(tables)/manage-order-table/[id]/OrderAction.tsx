"use client";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { updateOrderStatusAction } from "../action";
import { FulfillmentInfo } from "@/interface/Orders";

const OrderAction = ({
  id,
  fulfillment,
}: {
  id: string;
  fulfillment: FulfillmentInfo["status"];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const actionsByStatus: Record<
    FulfillmentInfo["status"],
    {
      label: string;
      next: FulfillmentInfo["status"];
      color?: "primary" | "danger";
      icon: React.ReactNode;
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
        label: "Hủy",
        next: "cancelled",
        color: "danger",
        icon: <CloseOutlined />,
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

  const actions = actionsByStatus[fulfillment] || [];

  const handleClick = async (next: FulfillmentInfo["status"]) => {
    try {
      setIsLoading(true);
      await updateOrderStatusAction(id, { fulfillmentStatus: next });
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
          onClick={() => handleClick(a.next)}
          loading={isLoading}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
};

export default OrderAction;
