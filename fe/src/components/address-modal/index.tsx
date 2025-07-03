"use client";

import React, { useState } from "react";
import { Form, Input, Modal } from "antd";

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
        title="Thêm địa chỉ mới"
        closable={true}
        open={isModalOpen}
        okText="Thêm"
        cancelText="Hủy"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Form form={form}>
              <div className="flex justify-between gap-2">
                <Form.Item
                  name="name"
                  label="Tên địa chỉ"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập tên địa chỉ" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Tên địa chỉ"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập tên địa chỉ" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label="Tên địa chỉ"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập tên địa chỉ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên địa chỉ"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập tên địa chỉ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên địa chỉ"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập tên địa chỉ" },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default App;
