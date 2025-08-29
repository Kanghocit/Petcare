import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import { OrderItem } from "@/interface/Orders";
import { getOrderByIdAction } from "../action";
import { Descriptions, Tooltip } from "antd";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import OrderAction from "./OrderAction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petcare Admin ",
  description: "Petcare",
  // other metadata
};

const ManageOrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getOrderByIdAction(id);
  const order = data?.order;

  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const statusBadgeColor = (s: string) =>
    s === "delivered"
      ? "success"
      : s === "unfulfilled"
        ? "warning"
        : s === "processing"
          ? "info"
          : "error";

  const customerItems = [
    { key: "1", label: "Họ tên", children: order.user?.name || "" },
    { key: "2", label: "Email", children: order.user?.email || "" },
    { key: "3", label: "Hạng", children: order.user?.rank || "new" },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Đơn hàng ${order.orderCode || order._id?.slice(-8)}`}
      />

      <OrderAction id={id} fulfillment={order.fulfillment?.status} />

      <div className="grid grid-cols-6 gap-4">
        <ComponentCard
          title={`Số lượng sản phẩm(${order.items.length})`}
          className="col-span-4 h-fit"
        >
          <div className="flex flex-col">
            {order.items?.map((it: OrderItem) => (
              <div
                key={it._id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      it.productSnapshot?.image ||
                      "/images/product/placeholder.png"
                    }
                    alt={"Product image"}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                    unoptimized
                  />
                  <div>
                    <div className="font-medium">
                      {it.productSnapshot?.title}
                    </div>
                    <div className="bold font-semibold text-gray-500">
                      {formatCurrency(it.priceAtPurchase)} x {it.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span
                    className={
                      it.product?.quantity < it.quantity ? "text-red-500" : ""
                    }
                  >
                    {formatCurrency(it.priceAtPurchase * it.quantity)}
                  </span>
                  {it.product?.quantity < it.quantity && (
                    <Tooltip title={`Tồn kho: ${it.product?.quantity}`}>
                      <ExclamationCircleOutlined className="!text-red-500" />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="mt-4 ml-auto w-full max-w-sm rounded-lg bg-white py-4">
            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>Phí vận chuyển</span>
              <span>{formatCurrency(order?.shipping?.fee ?? 0)}</span>
            </div>

            {Number(order?.discount?.amount) > 0 && (
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Giảm giá</span>
                <span>-{formatCurrency(order.discount.amount)}</span>
              </div>
            )}

            <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-800">
              <span>Tổng cộng</span>
              <span className="text-blue-600">
                {formatCurrency(order?.totalAmount ?? 0)}
              </span>
            </div>
          </div>
        </ComponentCard>
        <div className="col-span-2 flex flex-col gap-4">
          <ComponentCard title="Thông tin khách hàng" className="h-fit">
            <Descriptions title="Khách hàng" items={customerItems} column={1} />
          </ComponentCard>
          {/* Shipping */}
          <ComponentCard title="Giao hàng" className="h-fit">
            <div className="text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  Địa chỉ:{"  "}
                  <span className="text-md text-black">
                    {order.shippingAddress?.address === "store"
                      ? "Nhận hàng tại cửa hàng"
                      : order.shippingAddress?.address}{" "}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  Liên hệ:{"  "}
                  <span className="text-md text-black">
                    {order.shippingAddress?.phone}
                  </span>
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Thông tin đơn hàng" className="h-fit">
            <div className="text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  Ngày đặt hàng:{"  "}
                  <span className="text-md text-black">
                    {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  Trạng thái:{"  "}
                  <Badge color={statusBadgeColor(order.fulfillment?.status)}>
                    {order.fulfillment?.status === "unfulfilled"
                      ? "Chưa xử lý"
                      : order.fulfillment?.status === "processing"
                        ? "Đang xử lý"
                        : order.fulfillment?.status === "shipping"
                          ? "Đang giao hàng"
                          : order.fulfillment?.status === "shipped"
                            ? "Đã giao hàng"
                            : order.fulfillment?.status === "delivered"
                              ? "Đã nhận hàng"
                              : order.fulfillment?.status === "returned"
                                ? "Đã trả hàng"
                                : "Đã hủy"}
                  </Badge>
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Thanh toán và vận chuyển" className="h-fit">
            <div className="text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  Phương thức thanh toán:{"  "}
                  <span className="text-md text-black">
                    {order.payment?.method === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.payment?.method === "vnpay"
                        ? "Thanh toán qua VNPay"
                        : order.payment?.method === "momo"
                          ? "Thanh toán qua MoMo"
                          : "Thẻ tín dụng"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  Trạng thái thanh toán:{"  "}
                  <span className="text-md text-black">
                    {order.payment?.status === "paid"
                      ? "Đã thanh toán"
                      : order.payment?.status === "unpaid"
                        ? "Chưa thanh toán"
                        : order.payment?.status === "refunded"
                          ? "Đã hoàn tiền"
                          : "Đã hủy"}
                  </span>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </>
  );
};

export default ManageOrderDetailPage;
