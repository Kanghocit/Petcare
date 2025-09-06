"use client";

import React, { useState, useEffect } from "react";
import { App, Button, Form, Input, InputNumber, Modal } from "antd";
import UploadFile from "@/components/upload-file";
import { addBrandAction } from "./action";
import { useRouter } from "next/navigation";
import { updateBrandAction } from "./action";
import { Brand } from "@/interface/Brand";

type AppError = {
  message: string;
  code?: number;
};

interface BrandFormData {
  name: string;
  image?: string | string[];
  numberProducts?: number;
}

const ModalAddBrand: React.FC<{
  children?: React.ReactNode;
  initialValues?: Brand;
  action?: "create" | "update";
}> = ({ children, initialValues, action = "create" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [brandImages, setBrandImages] = useState<string[]>([]);
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const brandId = initialValues?._id;

  const showModal = () => {
    setIsModalOpen(true);
    // Khởi tạo brandImages với ảnh hiện tại khi mở modal
    if (initialValues?.image) {
      const currentImage = Array.isArray(initialValues.image)
        ? initialValues.image
        : [initialValues.image];
      setBrandImages(currentImage);
    }
  };

  // Reset form và brandImages khi modal đóng
  useEffect(() => {
    if (!isModalOpen) {
      setBrandImages([]);
      form.resetFields();
    }
  }, [isModalOpen, form]);

  const handleSubmit = async (formData: BrandFormData) => {
    console.log("formData", formData);
    setIsLoading(true);

    try {
      // Chuyển đổi image array thành string (lấy ảnh đầu tiên)
      const brandData = {
        ...formData,
        image: Array.isArray(formData.image)
          ? formData.image[0] || ""
          : formData.image || "",
      };

      const res =
        action === "create"
          ? await addBrandAction(brandData as unknown as Brand)
          : await updateBrandAction(brandId!, brandData as unknown as Brand);
      if (res?.ok) {
        message.success(
          action === "create"
            ? "Brand đã được tạo thành công!"
            : "Brand đã được cập nhật thành công!",
        );
        form.resetFields();
        router.refresh();
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      const error = err as AppError;
      message.error(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBrandImages([]);
    form.resetFields();
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setBrandImages(imageUrls);
    // Set giá trị vào form field
    form.setFieldValue("image", imageUrls);
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
        title={action === "create" ? "Thêm brand mới" : "Cập nhật brand"}
        closable
        open={isModalOpen}
        onCancel={handleCancel}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="horizontal"
            initialValues={initialValues}
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
        okText={action === "create" ? "Tạo brand" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên brand"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên brand" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số lượng sản phẩm"
          name="numberProducts"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng sản phẩm" },
          ]}
          labelAlign="left"
          initialValue={0}
        >
          <InputNumber min={0} disabled />
        </Form.Item>

        <Form.Item label="Ảnh brand" name="image" labelAlign="left">
          <UploadFile
            folder="brand"
            onImageUpload={handleImageUpload}
            maxCount={3}
            defaultImages={brandImages}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddBrand;
