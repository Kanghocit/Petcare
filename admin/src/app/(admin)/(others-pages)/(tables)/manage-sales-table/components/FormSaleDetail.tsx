"use client";

import React from "react";
import { DatePicker, Form, Input, Select } from "antd";
import type { FormInstance } from "antd";

import type { Dayjs } from "dayjs";

type FieldType = {
  name?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  discountType?: string;
};

interface FormSaleDetailProps {
  discountType: string;
  onDiscountTypeChange: (value: string) => void;
  onFinish: (values: FieldType) => void;
  loading?: boolean;
  formRef?: React.RefObject<FormInstance<FieldType> | null>;
  initialValues?: Partial<FieldType>;
  isUpdating?: boolean;
}

const FormSaleDetail: React.FC<FormSaleDetailProps> = ({
  discountType,
  onDiscountTypeChange,
  onFinish,
  formRef,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Expose form instance to parent
  React.useImperativeHandle(formRef, () => form);

  return (
    <Form
      form={form}
      name="basic"
      initialValues={{ discountType, ...initialValues }}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      preserve={false}
    >
      <Form.Item<FieldType>
        label="Tên khuyến mại"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên khuyến mại!" }]}
      >
        <Input placeholder="Nhập tên khuyến mại" />
      </Form.Item>
      <Form.Item<FieldType>
        label="Ngày bắt đầu"
        name="startDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item<FieldType>
        label="Ngày kết thúc"
        name="endDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item<FieldType>
        label="Loại khuyến mại"
        name="discountType"
        rules={[{ required: true, message: "Vui lòng chọn loại khuyến mại!" }]}
      >
        <Select
          showSearch
          placeholder="Chọn kiểu khuyến mại"
          value={discountType}
          onChange={(value) => {
            onDiscountTypeChange(value);
            form.setFieldsValue({ discountType: value });
          }}
          options={[
            { value: "percent", label: "Giảm giá phần trăm" },
            { value: "fixed", label: "Giảm giá tiền" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default FormSaleDetail;
