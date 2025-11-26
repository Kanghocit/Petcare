"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Radio, Input, Space, App } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { cancelOrderAction, requestReturnOrderAction } from "../action";
import { getSocket } from "@/libs/socket";

const { TextArea } = Input;

interface ModalConfirmProps {
  orderId: string;
  orderCode: string;
  fulfillmentStatus?: string;
  initialNote?: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  orderId,
  orderCode,
  fulfillmentStatus,
  initialNote,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const router = useRouter();

  // Local, realtime status synced via Socket.IO
  const [liveStatus, setLiveStatus] = useState<string | undefined>(
    fulfillmentStatus
  );
  // Kiểm tra xem đã có yêu cầu hoàn hàng chưa (từ note ban đầu hoặc từ socket)
  const [hasReturnRequest, setHasReturnRequest] = useState(
    initialNote?.includes("[RETURN_REQUEST]") || false
  );
  const [liveNote, setLiveNote] = useState<string | undefined>(initialNote);

  // Realtime: lắng nghe thay đổi trạng thái đơn hàng và note
  useEffect(() => {
    const socket = getSocket();

    type OrderUpdatedPayload = {
      orderId: string;
      fulfillmentStatus?: string;
      status?: string;
      note?: string;
    };

    const handleOrderUpdated = (payload: OrderUpdatedPayload) => {
      if (payload.orderId !== orderId) return;
      if (payload.fulfillmentStatus) {
        setLiveStatus(payload.fulfillmentStatus);
      }
      if (payload.note !== undefined) {
        setLiveNote(payload.note);
        // Nếu note có [RETURN_REQUEST] hoặc [RETURN_REJECTED] thì đã có yêu cầu hoàn hàng
        if (
          payload.note?.includes("[RETURN_REQUEST]") ||
          payload.note?.includes("[RETURN_REJECTED]")
        ) {
          setHasReturnRequest(true);
        }
      }
    };

    socket.on("order-updated", handleOrderUpdated);
    return () => {
      socket.off("order-updated", handleOrderUpdated);
    };
  }, [orderId]);

  const isDelivered = liveStatus === "delivered";

  const cancelReasons = [
    {
      value: "changed_mind",
      label: "Thay đổi ý định mua hàng",
      description: "Tôi không còn muốn mua sản phẩm này nữa",
    },
    {
      value: "found_better_price",
      label: "Tìm thấy giá tốt hơn",
      description: "Tôi đã tìm thấy sản phẩm tương tự với giá tốt hơn",
    },
    {
      value: "duplicate_order",
      label: "Đặt hàng trùng lặp",
      description: "Tôi đã đặt hàng này ở nơi khác",
    },
    {
      value: "shipping_too_long",
      label: "Thời gian giao hàng quá lâu",
      description: "Thời gian giao hàng không phù hợp với nhu cầu",
    },
    {
      value: "product_not_needed",
      label: "Không còn cần sản phẩm",
      description: "Tình huống thay đổi, không còn cần sản phẩm này",
    },
    {
      value: "other",
      label: "Lý do khác",
      description: "Vui lòng mô tả lý do cụ thể",
    },
  ];

  const returnReasons = [
    {
      value: "damaged_product",
      label: "Sản phẩm bị hư hỏng",
      description: "Sản phẩm nhận được bị vỡ, móp, hư hỏng khi vận chuyển",
    },
    {
      value: "wrong_product",
      label: "Giao sai sản phẩm",
      description: "Sản phẩm nhận được không đúng với đơn đặt hàng",
    },
    {
      value: "not_as_described",
      label: "Sản phẩm không đúng mô tả",
      description: "Chất lượng, mẫu mã khác với mô tả trên website",
    },
    {
      value: "change_of_mind_after_receive",
      label: "Đổi ý sau khi nhận hàng",
      description: "Tôi không còn nhu cầu sử dụng sản phẩm này nữa",
    },
    {
      value: "other",
      label: "Lý do khác",
      description: "Vui lòng mô tả lý do cụ thể",
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!cancelReason) {
      message.error(
        isDelivered
          ? "Vui lòng chọn lý do yêu cầu hoàn hàng"
          : "Vui lòng chọn lý do hủy đơn hàng"
      );
      return;
    }

    if (cancelReason === "other" && !otherReason.trim()) {
      message.error(
        isDelivered
          ? "Vui lòng mô tả lý do yêu cầu hoàn hàng"
          : "Vui lòng mô tả lý do hủy đơn hàng"
      );
      return;
    }

    setLoading(true);
    try {
      const finalReason = cancelReason === "other" ? otherReason : cancelReason;

      const res = isDelivered
        ? await requestReturnOrderAction(orderId, finalReason)
        : await cancelOrderAction(orderId, finalReason);

      if (res.ok) {
        message.success(
          isDelivered
            ? "Đã gửi yêu cầu hoàn hàng thành công"
            : "Đã hủy đơn hàng thành công"
        );
        setIsModalOpen(false);

        // Reset form
        setCancelReason("");
        setOtherReason("");
        if (isDelivered) {
          setHasReturnRequest(true);
        }
        router.refresh();
        if (!isDelivered) {
          router.push("/profile/orders");
        }
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(
        isDelivered
          ? "Có lỗi xảy ra khi gửi yêu cầu hoàn hàng"
          : "Có lỗi xảy ra khi hủy đơn hàng"
      );
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelReason("");
    setOtherReason("");
  };

  const handleReasonChange = (value: string) => {
    setCancelReason(value);
    if (value !== "other") {
      setOtherReason("");
    }
  };

  // Determine what actions user can do based on *current* status
  const canCancelNow =
    liveStatus !== "shipping" &&
    liveStatus !== "shipped" &&
    liveStatus !== "delivered" &&
    liveStatus !== "returned" &&
    liveStatus !== "cancelled";

  // Nếu admin đã xử lý yêu cầu hoàn hàng (chấp nhận hoặc từ chối), không hiển thị nút nữa
  const isReturnProcessed =
    liveStatus === "returned" || liveNote?.startsWith("[RETURN_REJECTED]");

  // Nếu admin đã xử lý (chấp nhận hoặc từ chối), không hiển thị nút nữa
  if (isReturnProcessed) {
    return null;
  }

  // Nếu đã gửi yêu cầu hoàn hàng rồi và vẫn đang ở trạng thái delivered,
  // không hiển thị nút nữa, chỉ hiển thị thông báo
  if (liveStatus === "delivered" && hasReturnRequest) {
    return (
      <div className="flex justify-end mb-4">
        <p className="text-sm text-blue-600">
          Bạn đã gửi yêu cầu hoàn hàng. Vui lòng chờ admin xử lý.
        </p>
      </div>
    );
  }

  // Nếu có thể hủy đơn hàng, hiển thị nút hủy
  if (canCancelNow) {
    // mode = "cancel" - sẽ được set ở return statement
  } else if (isDelivered) {
    // mode = "return" - sẽ được set ở return statement
  } else {
    // Không có hành động nào
    return null;
  }

  const mode: "cancel" | "return" = canCancelNow ? "cancel" : "return";

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant={mode === "cancel" ? "outlined" : "filled"}
          color={mode === "cancel" ? "danger" : "primary"}
          onClick={showModal}
          icon={<ExclamationCircleOutlined />}
          className="flex items-center gap-2"
          disabled={mode === "cancel" && !canCancelNow}
        >
          {mode === "cancel" ? "Hủy đơn hàng" : "Yêu cầu hoàn hàng"}
        </Button>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined />
            <span>
              {mode === "cancel"
                ? "Xác nhận hủy đơn hàng"
                : "Yêu cầu hoàn hàng"}
            </span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText={mode === "cancel" ? "Xác nhận hủy" : "Gửi yêu cầu"}
        cancelText="Đóng"
        okButtonProps={{
          danger: mode === "cancel",
          className:
            mode === "cancel"
              ? "bg-red-600 hover:bg-red-700 border-red-600"
              : "bg-blue-600 hover:bg-blue-700 border-blue-600",
        }}
        width={600}
        centered
      >
        <div className="py-4">
          {/* Thông tin đơn hàng */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <ExclamationCircleOutlined />
              <span className="font-semibold">Thông tin đơn hàng</span>
            </div>
            <p className="text-red-700">
              {mode === "cancel"
                ? "Bạn sắp hủy đơn hàng "
                : "Bạn muốn yêu cầu hoàn hàng cho đơn "}
              <strong>{orderCode}</strong>
            </p>
            <p className="text-red-600 text-sm mt-1">
              Hành động này không thể hoàn tác. Vui lòng xác nhận lý do hủy đơn
              hàng.
            </p>
          </div>

          {/* Chọn lý do hủy */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              {mode === "cancel"
                ? "Vui lòng chọn lý do hủy đơn hàng: *"
                : "Vui lòng chọn lý do yêu cầu hoàn hàng: *"}
            </h4>
            <Radio.Group
              value={cancelReason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {(mode === "cancel" ? cancelReasons : returnReasons).map(
                  (reason) => (
                    <Radio
                      key={reason.value}
                      value={reason.value}
                      className="w-full p-3 transition-colors"
                    >
                      <div className="ml-2">
                        <div className="font-medium text-gray-800">
                          {reason.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {reason.description}
                        </div>
                      </div>
                    </Radio>
                  )
                )}
              </Space>
            </Radio.Group>
          </div>

          {/* Lý do khác */}
          {cancelReason === "other" && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Mô tả lý do cụ thể: *
              </h4>
              <TextArea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Vui lòng mô tả chi tiết lý do hủy đơn hàng..."
                rows={4}
                maxLength={500}
                showCount
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Lưu ý */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2 text-blue-800">
              <ExclamationCircleOutlined className="mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Đơn hàng sẽ được hủy ngay lập tức</li>
                  <li>
                    Nếu đã thanh toán, tiền sẽ được hoàn trả trong 3-5 ngày làm
                    việc
                  </li>
                  <li>Bạn có thể đặt hàng lại bất cứ lúc nào</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirm;
