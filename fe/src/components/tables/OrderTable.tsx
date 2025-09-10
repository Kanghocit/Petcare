"use client";

import dayjs from "dayjs";
import { Space, Table, TableProps, Tag } from "antd";

interface Order {
  _id: string;
  orderCode: string;
  totalAmount: number;
  fulfillment: { status: string };
  items: Array<{ _id: string }>;
  createdAt: string;
}

const OrderTable = ({ orders }: { orders: Order[] }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusText = (
    status:
      | "unfulfilled"
      | "processing"
      | "shipping"
      | "shipped"
      | "delivered"
      | "cancelled"
  ) => {
    switch (status) {
      case "unfulfilled":
        return "Chưa xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã giao hàng";
      case "delivered":
        return "Đã nhận hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (
    status:
      | "unfulfilled"
      | "processing"
      | "shipping"
      | "shipped"
      | "delivered"
      | "cancelled"
  ) => {
    switch (status) {
      case "unfulfilled":
        return "orange";
      case "processing":
        return "blue";
      case "shipping":
        return "geekblue";
      case "shipped":
        return "cyan";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableProps<Order>["columns"] = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tổng hóa đơn",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) =>
        Number(amount) < 0 ? "0đ" : formatCurrency(amount),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "items",
      key: "items",
      render: (items: { _id: string }[]) => `${items.length} món`,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "fulfillment",
      render: (fulfillment: {
        status:
          | "unfulfilled"
          | "processing"
          | "shipping"
          | "shipped"
          | "delivered"
          | "cancelled";
      }) => (
        <Tag color={getStatusColor(fulfillment.status)}>
          {getStatusText(fulfillment.status)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: Order) => (
        <Space size="middle">
          <a
            className="text-blue-600 hover:text-blue-800"
            href={`/profile/orders/${record._id}`}
          >
            Xem chi tiết
          </a>
        </Space>
      ),
    },
  ];
  return (
    <Table<Order>
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} của ${total} đơn hàng`,
      }}
    />
  );
};

export default OrderTable;
