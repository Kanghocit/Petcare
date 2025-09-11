"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Form, Input, Modal } from "antd";
import UploadFile from "@/components/upload-file";
import { createAddressAction, updateAddressAction } from "./action";
import { useRouter } from "next/navigation";
import { Address } from "@/interface/Address";

type AppError = {
  message: string;
  code?: number;
};

interface AddressFormData {
  name: string;
  address: string;
  addressLink: string;
  images?: string[];
}

const ModalAddAddress: React.FC<{
  children?: React.ReactNode;
  initialValues?: Address;
  action?: "create" | "update";
}> = ({ children, initialValues, action = "create" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [addressImages, setAddressImages] = useState<string[]>([]);
  const [uploadKey, setUploadKey] = useState(0);
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const addressId =
    (initialValues as { _id?: string; id?: string } | undefined)?._id ??
    initialValues?._id;

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
        setAddressImages(
          (img.filter(Boolean) as string[]).map((u) => rewriteBannerPath(u)!),
        );
      } else if (typeof img === "string" && img) {
        setAddressImages([rewriteBannerPath(img)!]);
      } else {
        setAddressImages([]);
      }
    }
  }, [initialValues, form]);

  const showModal = () => {
    if (action === "create") {
      form.resetFields();
      setAddressImages([]);
      setUploadKey((k) => k + 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: AddressFormData) => {
    setIsLoading(true);

    try {
      // Tạo dữ liệu gửi đi bao gồm hình ảnh
      const submitData: Address = {
        _id: addressId || "", // Thêm id cho update, empty string cho create
        ...formData,
        image: addressImages.length > 0 ? addressImages[0] : "", // Lấy ảnh đầu tiên hoặc chuỗi rỗng
      };

      const res =
        action === "create"
          ? await createAddressAction(submitData)
          : await updateAddressAction(addressId!, submitData);
      if (res?.ok) {
        message.success(
          action === "create"
            ? "Địa chỉ đã được tạo thành công!"
            : "Địa chỉ đã được cập nhật thành công!",
        );
        form.resetFields();
        setAddressImages([]); // Reset hình ảnh
        setUploadKey((k) => k + 1);
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
    setAddressImages(imageUrls);
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
        title={action === "create" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
        closable
        open={isModalOpen}
        onCancel={handleCancel}
        destroyOnHidden
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
        okText={action === "create" ? "Tạo địa chỉ" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh" name="image" labelAlign="left">
          <UploadFile
            key={uploadKey}
            folder="address"
            onImageUpload={handleImageUpload}
            maxCount={1}
            defaultImages={addressImages}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Link địa chỉ"
          name="addressLink"
          rules={[{ required: true, message: "Vui lòng nhập link địa chỉ" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddAddress;
