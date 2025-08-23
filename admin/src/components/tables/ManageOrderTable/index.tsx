"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import TablePagination from "@/components/tables/TablePagination";
import { Orders } from "@/interface/Orders";
import { useRouter } from "next/navigation";

const ManageOrderTable = ({
  orders,
}: {
  orders?: { orders: Orders[]; total: number };
}) => {
  const { orders: ordersData, total } = orders || {};
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Tiền mặt";
      case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
      default:
        return method;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "authorized":
        return "warning";
      case "failed":
        return "error";
      default:
        return "primary";
    }
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "primary";
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
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Mã đơn hàng
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Người mua
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Đơn giá
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Phương thức thanh toán
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Trạng thái thanh toán
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Trạng thái đơn hàng
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Số lượng tồn kho
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
              {ordersData?.map((order: Orders) => (
                <TableRow
                  key={order._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {order.orderCode || order._id.slice(-8).toUpperCase()}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <>
                      <div className="flex gap-1">
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {order.user.name}
                        </p>
                        <Badge
                          size="sm"
                          color={
                            order.user.rank === "new"
                              ? "primary"
                              : order.user.rank === "regular"
                                ? "info"
                                : order.user.rank === "loyal"
                                  ? "warning"
                                  : "success"
                          }
                        >
                          {order.user.rank ?? "new"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.user.phone}
                      </p>
                    </>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {order.items.length} sản phẩm
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items
                          .map((item) => `${item.quantity}x`)
                          .join(", ")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {getPaymentMethodText(order.payment.method)}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getPaymentStatusColor(order.payment.status)}
                    >
                      {order.payment.status === "paid"
                        ? "Đã thanh toán"
                        : order.payment.status === "authorized"
                          ? "Đã ủy quyền"
                          : order.payment.status === "failed"
                            ? "Thanh toán thất bại"
                            : order.payment.status === "refunded"
                              ? "Đã hoàn tiền"
                              : order.payment.status === "partially_refunded"
                                ? "Hoàn tiền một phần"
                                : order.payment.status === "voided"
                                  ? "Đã hủy"
                                  : order.payment.status === "chargeback"
                                    ? "Tranh chấp"
                                    : "Chưa thanh toán"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getFulfillmentStatusColor(
                        order.fulfillment.status,
                      )}
                    >
                      {order.fulfillment.status === "unfulfilled"
                        ? "Chưa xử lý"
                        : order.fulfillment.status === "processing"
                          ? "Đang xử lý"
                          : order.fulfillment.status === "shipped"
                            ? "Đã giao hàng"
                            : order.fulfillment.status === "delivered"
                              ? "Đã nhận hàng"
                              : order.fulfillment.status === "returned"
                                ? "Đã trả hàng"
                                : order.fulfillment.status === "cancelled"
                                  ? "Đã hủy"
                                  : order.fulfillment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.items.map((item, idx) => {
                      const orderedQty = item.quantity;
                      //eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const stockQty = (item as any)?.product?.quantity ?? 0; // tồn kho
                      const isOut = stockQty < orderedQty;

                      return (
                        <span
                          key={idx}
                          className={
                            isOut
                              ? "font-semibold text-red-500"
                              : "text-gray-700"
                          }
                        >
                          {stockQty}
                          {idx < order.items.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    {/* View button */}
                    <Button
                      className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<EyeOutlined className="!text-blue-400" />}
                      onClick={() =>
                        router.push(`/manage-order-table/${order._id}`)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination total={total || 0} link="/manage-order-table" />
        </div>
      </div>
    </div>
  );
};

export default ManageOrderTable;
