"use client";

import React, { useState } from "react";
import { App, Button, Form, Input, Modal, Select } from "antd";

// import { useRouter } from "next/navigation";
import { Category } from "@/interface/Category";
import { createCategoryAction, updateCategoryAction } from "./action";
import { useRouter } from "next/navigation";

const ModalAddCategory: React.FC<{
  children?: React.ReactNode;
  initialValues?: Partial<Category>;
  action?: "create" | "update";
  categories: { categories: Category[]; total?: number } | Category[];
}> = ({ children, initialValues, action = "create", categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  //   const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: Category) => {
    try {
      setIsLoading(true);
      const payload: Category = {
        name: formData.name,
        parentId: formData.parentId || null,
      } as Category;

      const res =
        action === "create"
          ? await createCategoryAction(payload)
          : await updateCategoryAction(initialValues?.slug as string, payload);

      if (res?.ok) {
        message.success(
          action === "create"
            ? "Tạo danh mục thành công"
            : "Cập nhật danh mục thành công",
        );
        setIsModalOpen(false);
        router.refresh();
        form.resetFields();
      } else {
        message.error(res?.message || "Có lỗi xảy ra");
      }
    } catch {
      message.error(
        action === "create"
          ? "Có lỗi khi tạo danh mục"
          : "Có lỗi khi cập nhật danh mục",
      );
    } finally {
      setIsLoading(false);
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
        title={action === "create" ? "Thêm danh mục mới" : "Cập nhật danh mục"}
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
        okText={action === "create" ? "Tạo danh mục" : "Cập nhật"}
        cancelText="Quay lại"
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Điền tên danh mục" />
        </Form.Item>

        <Form.Item label="Danh mục cha" name="parentId">
          <Select
            allowClear
            placeholder="Chọn danh mục cấp 1 (tuỳ chọn)"
            options={(Array.isArray(categories)
              ? categories
              : categories?.categories || []
            ).map((c: Category) => ({ value: c._id as string, label: c.name }))}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ModalAddCategory;
