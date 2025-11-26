"use client";

import { Badge } from "antd";
import { useEffect, useState } from "react";
import { getSocket } from "@/libs/socket";

type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipping"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled"
  | string;

interface OrderStatusProps {
  orderId: string;
  initialStatus: FulfillmentStatus;
  initialNote?: string;
}

const getStatusText = (status: FulfillmentStatus) => {
  switch (status) {
    case "unfulfilled":
      return "Chưa xử lý";
    case "processing":
      return "Đang xử lý";
    case "shipping":
      return "Đang giao hàng";
    case "shipped":
      return "Đã giao hàng";
    case "delivered":
      return "Đã nhận hàng";
    case "returned":
      return "Đã trả hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

const getStatusColor = (status: FulfillmentStatus) => {
  switch (status) {
    case "delivered":
      return "success";
    case "unfulfilled":
      return "warning";
    case "processing":
    case "shipping":
    case "shipped":
      return "processing";
    case "cancelled":
    case "returned":
      return "error";
    default:
      return "default";
  }
};

type OrderUpdatedPayload = {
  orderId: string;
  fulfillmentStatus?: FulfillmentStatus;
  status?: string;
  note?: string;
};

const OrderStatus = ({
  orderId,
  initialStatus,
  initialNote,
}: OrderStatusProps) => {
  const [status, setStatus] = useState<FulfillmentStatus>(initialStatus);
  const [note, setNote] = useState<string | undefined>(initialNote);

  useEffect(() => {
    const socket = getSocket();

    const handleOrderUpdated = (payload: OrderUpdatedPayload) => {
      if (payload.orderId !== orderId) return;
      if (payload.fulfillmentStatus) {
        setStatus(payload.fulfillmentStatus);
      }
      if (payload.note !== undefined) {
        setNote(payload.note);
      }
    };

    socket.on("order-updated", handleOrderUpdated);
    return () => {
      socket.off("order-updated", handleOrderUpdated);
    };
  }, [orderId]);

  return (
    <>
      <Badge
        status={getStatusColor(status)}
        text={getStatusText(status)}
        className="text-lg font-semibold"
      />
      {note?.startsWith("[RETURN_REJECTED]") && (
        <p className="mt-2 text-sm text-red-600">
          Yêu cầu hoàn hàng không thành công.{" "}
          {note.replace("[RETURN_REJECTED]", "").trim()}
        </p>
      )}
    </>
  );
};

export default OrderStatus;
