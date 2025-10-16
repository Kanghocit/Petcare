"use client";

import React, { useState } from "react";
import { App, Button, Form, Input, Modal } from "antd";
import { CreateStaffAction } from "./action";
import { useRouter } from "next/navigation";

type AppError = {
    message: string;
    code?: number;
};

interface StaffFormData {
    name: string;
    email: string;
    username: string;
    password: string;
}

const ModalAddStaff: React.FC<{
    children?: React.ReactNode;
    initialValues?: Partial<StaffFormData>;
    action?: "create";
}> = ({ children, initialValues, action = "create" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const router = useRouter();
    const { message } = App.useApp();
    const [form] = Form.useForm();


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: StaffFormData) => {
        setIsLoading(true);

        try {
            const res = await CreateStaffAction(formData);
            if (res?.ok) {
                message.success("Tạo nhân viên thành công!");
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
                title={"Thêm nhân viên mới"}
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
                okText={"Tạo nhân viên"}
                cancelText="Quay lại"
            >
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email" }]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                >
                    <Input placeholder="Nhập tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>


            </Modal>
        </>
    );
};

export default ModalAddStaff;
