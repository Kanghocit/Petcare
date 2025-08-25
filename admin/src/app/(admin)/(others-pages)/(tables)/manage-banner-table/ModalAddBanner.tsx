"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Form, Input, Modal, InputNumber } from "antd";
import UploadFile from "@/components/upload-file";
import { createBannerAction, updateBannerAction } from "./action";
import { useRouter } from "next/navigation";
import { Banner } from "@/interface/Banner";

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
  images?: string[];
  quantity?: number;
}

const ModalAddBanner: React.FC<{
  children?: React.ReactNode;
  initialValues?: Banner;
  action?: "create" | "update";
}> = ({ children, initialValues, action = "create" }) => {
  console.log("init", initialValues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const bannerId =
    (initialValues as { _id?: string; id?: string } | undefined)?._id ??
    initialValues?.id;

  // Prefill form and images when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      // Normalize image into array for UploadFile defaultImages
      const img = (initialValues as unknown as { image?: string | string[] })
        .image;
      const rewriteBannerPath = (u?: string) =>
        u ? u.replace(/(^|\/)images\/banner\//, "$1images/hero/") : u;
      if (Array.isArray(img)) {
        setProductImages(
          (img.filter(Boolean) as string[]).map((u) => rewriteBannerPath(u)!),
        );
      } else if (typeof img === "string" && img) {
        setProductImages([rewriteBannerPath(img)!]);
      } else {
        setProductImages([]);
      }
    }
  }, [initialValues, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: ProductFormData) => {
    setIsLoading(true);

    // Nếu không phải sản phẩm sale thì loại bỏ discount
    const finalFormData: Banner = {
      // id giữ nguyên nếu là update (đã nằm trong initialValues khi setFieldsValue)
      ...(initialValues?.id ? { id: initialValues.id } : {}),
      title: formData.title as unknown as string,
      // Banner BE nhận image là string -> lấy ảnh đầu tiên (nếu có)
      image:
        Array.isArray(productImages) && productImages.length > 0
          ? productImages[0]
          : "",
      // sort lấy từ form (nếu để trống, BE sẽ tự set theo pre-save)
      sort:
        (form.getFieldValue("sort") as number | undefined) ??
        initialValues?.sort ??
        0,
    } as Banner;

    try {
      const res =
        action === "create"
          ? await createBannerAction(finalFormData as unknown as Banner)
          : await updateBannerAction(
              bannerId!,
              finalFormData as unknown as Banner,
            );
      if (res?.ok) {
        message.success(
          action === "create"
            ? "Banner đã được tạo thành công!"
            : "Banner đã được cập nhật thành công!",
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
        title={action === "create" ? "Thêm banner mới" : "Cập nhật banner"}
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
        okText={action === "create" ? "Tạo banner" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên banner"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên banner" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh banner" name="image">
          <UploadFile
            folder="banner"
            onImageUpload={handleImageUpload}
            maxCount={3}
            defaultImages={productImages}
          />
        </Form.Item>

        <Form.Item label="Vị trí banner" name="sort">
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddBanner;
