"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Form, Input, Modal, Checkbox, InputNumber } from "antd";
import UploadFile from "@/components/upload-file";
import BrandSelect from "@/components/form/BrandSelect";
import { CreateProductAction, UpdateProductAction } from "./action";
import { useRouter } from "next/navigation";
import { Product } from "@/interface/Products";
import { Brand } from "@/interface/Brand";
import CategorySelect from "@/components/form/CategorySelect";
import { Category } from "@/interface/Category";

type AppError = {
  message: string;
  code?: number;
};

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discount?: number; // <-- có thể undefined khi không sale
  isNewProduct: boolean;
  isSaleProduct: boolean;
  star: number;
  brand: string;
  category: string;
  images?: string[];
  quantity?: number;
}

const ModalAddProduct: React.FC<{
  children?: React.ReactNode;
  initialValues?: Product;
  action?: "create" | "update";
  brands: { brands: Brand[]; total: number };
  categories: { categories: Category[]; total: number };
}> = ({ children, initialValues, action = "create", brands, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // 👉 theo dõi trạng thái checkbox
  const isSaleProduct = Form.useWatch("isSaleProduct", form);

  useEffect(() => {
    // Khi bỏ check "Đang giảm giá" thì clear discount
    if (!isSaleProduct) {
      form.setFieldValue("discount", undefined);
    }
  }, [isSaleProduct, form]);

  // Prefill form and images when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (Array.isArray(initialValues.images)) {
        setProductImages(initialValues.images);
      }
    }
  }, [initialValues, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: ProductFormData) => {
    setIsLoading(true);

    // Nếu không phải sản phẩm sale thì loại bỏ discount
    const finalFormData = {
      ...formData,
      discount: formData.isSaleProduct ? formData.discount : undefined,
      images: productImages,
    };

    try {
      const res =
        action === "create"
          ? await CreateProductAction(finalFormData as unknown as Product)
          : await UpdateProductAction(
              initialValues?.slug || "",
              finalFormData as unknown as Product,
            );
      if (res?.ok) {
        message.success(
          action === "create"
            ? "Sản phẩm đã được tạo thành công!"
            : "Sản phẩm đã được cập nhật thành công!",
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
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setProductImages(imageUrls);
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
        title={action === "create" ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
        closable
        open={isModalOpen}
        onCancel={handleCancel}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="horizontal"
            initialValues={initialValues}
            onFinish={handleSubmit}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {dom}
          </Form>
        )}
        okButtonProps={{
          htmlType: "submit",
          loading,
        }}
        okText={action === "create" ? "Tạo sản phẩm" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên sản phẩm"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Điền tên sản phẩm" />
        </Form.Item>

        <Form.Item label="Ảnh sản phẩm" name="images">
          <UploadFile
            folder="product"
            onImageUpload={handleImageUpload}
            maxCount={3}
            defaultImages={productImages}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Thêm mô tả" />
        </Form.Item>
        <Form.Item label="Danh mục" name="category">
          <CategorySelect categories={categories} />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Thêm giá sản phẩm"
          />
        </Form.Item>

        <Form.Item label="Số lượng" name="quantity">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Là sản phẩm mới"
          name="isNewProduct"
          valuePropName="checked"
        >
          <Checkbox>Có</Checkbox>
        </Form.Item>

        <Form.Item
          label="Đang giảm giá"
          name="isSaleProduct"
          valuePropName="checked"
        >
          <Checkbox>Có</Checkbox>
        </Form.Item>

        {/* 👉 Chỉ hiện khi isSaleProduct = true */}
        <Form.Item
          label="Giảm giá"
          name="discount"
          hidden={!isSaleProduct}
          rules={
            isSaleProduct
              ? [
                  { required: true, message: "Vui lòng nhập % giảm giá" },
                  { type: "number", min: 1, max: 100, message: "1–100%" },
                ]
              : []
          }
        >
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Hãng" name="brand">
          <BrandSelect brands={brands} />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddProduct;
