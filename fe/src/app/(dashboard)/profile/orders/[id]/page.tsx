import React from "react";
import { getOrderByIdAction } from "../action";
import { Badge } from "antd";
import dayjs from "dayjs";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import {
  ShoppingCartOutlined,
  UserOutlined,
  TruckOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import BreadCrumb from "@/components/breadCrumb";
import ModalConfirm from "./components/ModalConfirm";

// No revalidate for user-specific pages (dynamic)
export const dynamic = "force-dynamic";

// Generate dynamic metadata for order pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return createMetadata({
    title: `Đơn hàng #${id.slice(-8)}`,
    description: "Chi tiết đơn hàng của bạn",
    robots: {
      index: false,
      follow: false,
    },
  });
}

interface OrderItem {
  _id: string;
  quantity: number;
  priceAtPurchase: number;
  productSnapshot: {
    title: string;
    image: string;
  };
  product?: {
    quantity: number;
  };
}

export interface OrderData {
  _id: string;
  orderCode: string;
  subtotal: number;
  totalAmount: number;
  shipping: { fee: number };
  discount: { amount: number };
  payment: { method: string; status: string };
  fulfillment: { status: string };
  shippingAddress: {
    address: string;
    phone: string;
    fullName: string;
    email: string;
  };
  user: { name: string; email: string; rank: string };
  items: OrderItem[];
  createdAt: string;
}

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const orderData = await getOrderByIdAction(id);
  const order = orderData?.order as OrderData;

  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getStatusText = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "unfulfilled":
        return "warning";
      case "processing":
        return "processing";
      case "shipping":
        return "processing";
      case "shipped":
        return "processing";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "ck":
        return "Thanh toán bằng chuyển khoản";
      case "momo":
        return "Thanh toán qua MoMo";
      default:
        return "Thẻ tín dụng";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chưa thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Đã hủy";
    }
  };

  return (
    <>
      <BreadCrumb />
      <div className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái - Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            <ModalConfirm
              orderId={order._id}
              orderCode={order.orderCode || order._id?.slice(-8)}
              canCancel={
                order.fulfillment?.status !== "shipping" &&
                order.fulfillment?.status !== "shipped" &&
                order.fulfillment?.status !== "delivered"
              }
            />

            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ShoppingCartOutlined className="text-blue-600" />
                  Sản phẩm đã đặt ({order.items.length})
                </h3>
                <p className="text-blue-300 text-sm">
                  Đặt hàng lúc{" "}
                  {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div className="space-y-4">
                {order.items?.map((item: OrderItem, index: number) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={
                            item.productSnapshot?.image ||
                            "/images/product/placeholder.png"
                          }
                          alt="Product image"
                          width={70}
                          height={70}
                          className="rounded-xl object-cover shadow-md"
                          unoptimized
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {item.productSnapshot?.title}
                        </div>
                        <div className="text-gray-500">
                          {formatCurrency(item.priceAtPurchase)} ×{" "}
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-800">
                        {formatCurrency(item.priceAtPurchase * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="flex justify-end">
              <div className=" rounded-2xl p-6 w-full max-w-md shadow-xl border border-green-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCardOutlined className="text-green-600" />
                  Tổng tiền
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 py-2 border-b border-gray-200">
                    <span>Tạm tính</span>
                    <span className="font-medium">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 py-2 border-b border-gray-200">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {formatCurrency(order.shipping?.fee || 0)}
                    </span>
                  </div>
                  {Number(order.discount?.amount) > 0 && (
                    <div className="flex justify-between text-green-600 py-2 border-b border-gray-200">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{formatCurrency(order.discount.amount)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin chi tiết */}
          <div className="space-y-6">
            {/* Trạng thái đơn hàng */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-xl border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <TruckOutlined className="text-blue-600" />
                Trạng thái đơn hàng
              </h3>
              <Badge
                status={getStatusColor(order.fulfillment?.status)}
                text={getStatusText(order.fulfillment?.status)}
                className="text-lg font-semibold"
              />
            </div>

            {/* Thông tin khách hàng */}
            <div className=" rounded-2xl p-6 shadow-xl border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                <UserOutlined className="text-purple-600" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="text-purple-600 font-medium">Họ tên:</span>
                  <span className="font-semibold text-gray-800">
                    {order.user?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="text-purple-600 font-medium">Email:</span>
                  <span className="font-semibold text-gray-800">
                    {order.user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-purple-600 font-medium">Hạng:</span>
                  <span className="font-semibold text-gray-800">
                    {order.user?.rank || "Mới"}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className=" rounded-2xl p-6 shadow-xl border border-orange-100">
              <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                <TruckOutlined className="text-orange-600" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start py-2 border-b border-orange-200">
                  <span className="text-orange-600 font-medium">Địa chỉ:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                    {order.shippingAddress?.address === "store"
                      ? "Nhận hàng tại cửa hàng"
                      : order.shippingAddress?.address}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-orange-600 font-medium">Liên hệ:</span>
                  <span className="font-semibold text-gray-800">
                    {order.shippingAddress?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className=" rounded-2xl p-6 shadow-xl border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <CreditCardOutlined className="text-green-600" />
                Thông tin thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start py-2 border-b border-green-200">
                  <span className="text-green-600 font-medium">
                    Phương thức:
                  </span>
                  <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                    {getPaymentMethodText(order.payment?.method)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-green-600 font-medium">
                    Trạng thái:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {getPaymentStatusText(order.payment?.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
