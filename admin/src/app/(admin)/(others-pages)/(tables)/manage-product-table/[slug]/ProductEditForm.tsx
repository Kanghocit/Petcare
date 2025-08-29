"use client";

import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Form,
  Input,
  Checkbox,
  InputNumber,
  Card,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import UploadFile from "@/components/upload-file";
import { Product } from "@/interface/Products";
import { useRouter } from "next/navigation";
import { UpdateProductAction } from "../action";

interface ProductEditFormProps {
  product: Product;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ product }) => {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<Product>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const isSaleProduct = Form.useWatch("isSaleProduct", form);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
      setImages(product.images || []);
    }
  }, [product, form]);

  const handleSubmit = async (values: Product) => {
    setLoading(true);
    try {
      const payload: Product = {
        ...values,
        images,
        discount: values.isSaleProduct
          ? values.discount
          : (undefined as unknown as number),
        slug: product.slug,
      };
      const res = await UpdateProductAction(product.slug, payload);
      if (res?.ok) {
        message.success("Cập nhật sản phẩm thành công");
        router.push("/manage-product-table");
        router.refresh();
      } else {
        message.error(res?.message || "Cập nhật thất bại");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      message.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={product}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Tổng quan">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Hãng" name="brand">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Số sao" name="star">
                  <InputNumber min={1} max={5} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Số lượng" name="quantity">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="isNewProduct"
                      valuePropName="checked"
                      label="Là sản phẩm mới"
                    >
                      <Checkbox>Có</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="isSaleProduct"
                      valuePropName="checked"
                      label="Đang giảm giá"
                    >
                      <Checkbox>Có</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {isSaleProduct && (
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Giảm giá"
                    name="discount"
                    rules={[
                      { required: true, message: "Vui lòng nhập % giảm giá" },
                      { type: "number", min: 1, max: 100, message: "1–100%" },
                    ]}
                  >
                    <InputNumber min={1} max={100} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} md={12}>
                <Form.Item label="Trạng thái" name="status">
                  <Select
                    options={[
                      { value: "active", label: "Đang bán" },
                      { value: "inactive", label: "Tạm dừng bán" },
                      { value: "archived", label: "Không bán nữa" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Hình ảnh" className="mt-4!">
            <Form.Item label="Ảnh sản phẩm" name="images">
              <UploadFile
                folder="product"
                onImageUpload={(urls) => setImages(urls)}
                maxCount={3}
                defaultImages={images}
              />
            </Form.Item>
          </Card>

          <Card title="Videos" className="mt-4!">
            <Typography.Text type="secondary">
              Chưa hỗ trợ video. Bạn có thể thêm sau.
            </Typography.Text>
          </Card>

          <Card title="Related Products" className="mt-4!">
            <Typography.Text type="secondary">
              Tính năng gợi ý sản phẩm liên quan sẽ được bổ sung.
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Giá">
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            {isSaleProduct && (
              <Form.Item
                label="Giảm giá (%)"
                name="discount"
                rules={[
                  { required: true, message: "Vui lòng nhập % giảm giá" },
                  { type: "number", min: 1, max: 100, message: "1–100%" },
                ]}
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
            )}
          </Card>

          <Card className="mt-4!">
            <div className="flex gap-2">
              <Button onClick={() => router.back()}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductEditForm;
