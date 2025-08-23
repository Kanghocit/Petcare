"use client";

import React, { useState } from "react";
import { Button, Modal, Radio, Input, Space, App } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { cancelOrderAction } from "../action";

const { TextArea } = Input;

interface ModalConfirmProps {
  orderId: string;
  orderCode: string;
  canCancel?: boolean;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  orderId,
  orderCode,
  canCancel = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const router = useRouter();

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!cancelReason) {
      message.error("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    if (cancelReason === "other" && !otherReason.trim()) {
      message.error("Vui lòng mô tả lý do hủy đơn hàng");
      return;
    }

    setLoading(true);
    try {
      const finalReason = cancelReason === "other" ? otherReason : cancelReason;

      const res = await cancelOrderAction(orderId, finalReason);
      console.log("res", res);
      if (res.ok) {
        message.success("Đã hủy đơn hàng thành công");
        setIsModalOpen(false);

        // Reset form
        setCancelReason("");
        setOtherReason("");
        router.refresh();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng");
      console.error("Error canceling order:", error);
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

  if (!canCancel) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="outlined"
          color="danger"
          onClick={showModal}
          icon={<ExclamationCircleOutlined />}
          className="flex items-center gap-2"
        >
          Hủy đơn hàng
        </Button>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined />
            <span>Xác nhận hủy đơn hàng</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{
          danger: true,
          className: "bg-red-600 hover:bg-red-700 border-red-600",
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
              Bạn sắp hủy đơn hàng <strong>{orderCode}</strong>
            </p>
            <p className="text-red-600 text-sm mt-1">
              Hành động này không thể hoàn tác. Vui lòng xác nhận lý do hủy đơn
              hàng.
            </p>
          </div>

          {/* Chọn lý do hủy */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              Vui lòng chọn lý do hủy đơn hàng: *
            </h4>
            <Radio.Group
              value={cancelReason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {cancelReasons.map((reason) => (
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
                ))}
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
