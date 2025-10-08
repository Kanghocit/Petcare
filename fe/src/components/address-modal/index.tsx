"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Form, Input, Modal, Checkbox, App } from "antd";
import { useRouter } from "next/navigation";
import type { Address } from "@/interface/address";

const AddressModal: React.FC<{
  children: React.ReactNode;
  onSubmit: (address: Address) => Promise<any>;
  initialAddress?: Partial<Address>;
  modalTitle?: string;
  okText?: string;
}> = ({ children, onSubmit, initialAddress, modalTitle, okText }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<Address>();
  const [isPending, startTransition] = useTransition();
  const { message } = App.useApp();
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        _id: initialAddress?._id as any,
        name: initialAddress?.name ?? "",
        isDefault: !!initialAddress?.isDefault,
      } as any);
    }
  }, [isModalOpen, initialAddress, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        _id: values._id,
        name: values.name,
        isDefault: Boolean(values.isDefault),
      };

      const actionText = okText ? "Lưu" : "Thêm";

      startTransition(async () => {
        try {
          const res = await onSubmit(payload);

          if (res?.ok) {
            message.success(`${actionText} địa chỉ thành công`);
            setIsModalOpen(false);
            form.resetFields();
            router.refresh();
          } else {
            message.error(res?.error || res?.message || `${actionText} địa chỉ thất bại`);
          }
        } catch {
          message.error("Có lỗi xảy ra");
        }
      });
    } catch {
      // Ant Design form sẽ tự hiển thị lỗi validation
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={showModal}>
        {children}
      </div>
      <Modal
        title={modalTitle || "Thêm địa chỉ mới"}
        closable={true}
        open={isModalOpen}
        okText={okText || "Thêm"}
        cancelText="Hủy"
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isPending}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Form form={form} layout="vertical" initialValues={{ isDefault: false }}>
              <Form.Item name="_id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên địa chỉ"
                required
                rules={[{ required: true, message: "Vui lòng nhập tên địa chỉ" }]}
              >
                <Input placeholder="Ví dụ: Nhà, Công ty..." />
              </Form.Item>
              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddressModal;
