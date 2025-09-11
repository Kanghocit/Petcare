"use client";

import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import { createVoicherAction, updateVoicherAction } from "./action";
import { useRouter } from "next/navigation";
import { Voicher } from "@/interface/Voicher";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type AppError = {
  message: string;
  code?: number;
};

interface VoicherFormData {
  name: string;
  code: string;
  discountValue: number | string;
  startDate: string;
  endDate: string;
  maxUsers: number;
  status: "active" | "inactive";
  usedCount?: number;
}

const ModalAddVoicher: React.FC<{
  children?: React.ReactNode;
  initialValues?: Voicher;
  action?: "create" | "update";
}> = ({ children, initialValues, action = "create" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // Prefill form when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate
          ? dayjs(initialValues.startDate)
          : null,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
      });
    }
  }, [initialValues, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    formData: VoicherFormData & {
      startDate: Dayjs | string;
      endDate: Dayjs | string;
    },
  ) => {
    setIsLoading(true);

    try {
      const start = dayjs(formData.startDate as string | Dayjs);
      const end = dayjs(formData.endDate as string | Dayjs);
      const payload: Partial<Voicher> = {
        ...formData,
        startDate: start.isValid() ? start.toDate().toISOString() : "",
        endDate: end.isValid() ? end.toDate().toISOString() : "",
      };

      const res =
        action === "create"
          ? await createVoicherAction(payload)
          : await updateVoicherAction(initialValues?._id || "", payload);
      if (res?.ok) {
        message.success(
          action === "create"
            ? "Voicher đã được tạo thành công!"
            : "Voicher đã được cập nhật thành công!",
        );
        form.resetFields();
        router.refresh();
        setIsModalOpen(false);
      } else {
        message.error(res.message);
      }
    } catch (err: unknown) {
      const error = err as AppError;
      console.log("error", err);
      message.error(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {children ? (
        <div className="cursor-pointer" onClick={showModal}>
          {children}
        </div>
      ) : (
        <Button color="primary" variant="outlined" onClick={showModal}>
          Thêm
        </Button>
      )}
      <Modal
        title={action === "create" ? "Thêm voicher mới" : "Cập nhật voicher"}
        closable
        open={isModalOpen}
        destroyOnHidden
        onCancel={handleCancel}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
          >
            {dom}
          </Form>
        )}
        okButtonProps={{
          htmlType: "submit",
          loading,
        }}
        okText={action === "create" ? "Tạo voicher" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên voicher"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên voicher" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã voicher"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã voicher" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá trị giảm"
          name="discountValue"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          labelAlign="left"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          labelAlign="left"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          labelAlign="left"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Người dùng tối đa" name="maxUsers" labelAlign="left">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" labelAlign="left">
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddVoicher;
