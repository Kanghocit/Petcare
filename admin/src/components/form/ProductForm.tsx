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
import BrandSelect from "@/components/form/BrandSelect";
import { Product } from "@/interface/Products";
import { Brand } from "@/interface/Brand";
import CategorySelect from "./CategorySelect";
import { Category } from "@/interface/Category";

interface ProductFormProps {
  product?: Product;
  brands: { brands: Brand[]; total: number };
  categories: { categories: Category[]; total: number };
  onSubmit: (values: Product) => Promise<void>;
  loading?: boolean;
  submitText?: string;
  showImages?: boolean;
  showVideos?: boolean;
  showRelated?: boolean;
  layout?: "horizontal" | "vertical";
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  brands,
  categories,
  onSubmit,
  loading = false,
  submitText = "Lưu",
  showImages = true,
  showVideos = false,
  showRelated = false,
  layout = "vertical",
  onCancel,
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<Product>();

  const [images, setImages] = useState<string[]>(product?.images || []);

  const isSaleProduct = Form.useWatch("isSaleProduct", form);

  const showDiscount =
    typeof isSaleProduct === "boolean"
      ? isSaleProduct
      : (product?.isSaleProduct ?? false);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
      setImages(product.images || []);
    }
  }, [product, form]);

  useEffect(() => {
    // Khi bỏ check "Đang giảm giá" thì clear discount
    if (isSaleProduct === false) {
      form.setFieldValue("discount", undefined);
    }
  }, [isSaleProduct, form]);

  const handleSubmit = async (values: Product) => {
    try {
      const payload: Product = {
        ...values,
        images,
        discount: values.isSaleProduct
          ? values.discount
          : (undefined as unknown as number),
        ...(product?.slug && { slug: product.slug }),
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      const error = err as { message?: string };
      message.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setImages(imageUrls);
  };

  const formLayout =
    layout === "horizontal"
      ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        }
      : {};

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={handleSubmit}
      initialValues={product}
      {...formLayout}
    >
      {layout === "vertical" ? (
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
                    <Input placeholder="Điền tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} placeholder="Thêm mô tả" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Hãng" name="brand">
                    <BrandSelect brands={brands} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Danh mục" name="category">
                    <CategorySelect categories={categories} />
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

            {showImages && (
              <Card title="Hình ảnh" className="mt-4!">
                <Form.Item label="Ảnh sản phẩm" name="images">
                  <UploadFile
                    folder="product"
                    onImageUpload={handleImageUpload}
                    maxCount={3}
                    defaultImages={images}
                  />
                </Form.Item>
              </Card>
            )}

            {showVideos && (
              <Card title="Videos" className="mt-4!">
                <Typography.Text type="secondary">
                  Chưa hỗ trợ video. Bạn có thể thêm sau.
                </Typography.Text>
              </Card>
            )}

            {showRelated && (
              <Card title="Related Products" className="mt-4!">
                <Typography.Text type="secondary">
                  Tính năng gợi ý sản phẩm liên quan sẽ được bổ sung.
                </Typography.Text>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Giá">
              <Form.Item
                label="Giá nhập"
                name="importPrice"
                rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Thêm giá nhập sản phẩm"
                />
              </Form.Item>
              <Form.Item
                label="Giá bán"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Thêm giá bán sản phẩm"
                />
              </Form.Item>
              {showDiscount && (
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
                {onCancel && <Button onClick={onCancel}>Hủy</Button>}
                <Button type="primary" htmlType="submit" loading={loading}>
                  {submitText}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        // Horizontal layout for modal
        <>
          <Form.Item
            label="Tên sản phẩm"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Điền tên sản phẩm" />
          </Form.Item>

          {showImages && (
            <Form.Item label="Ảnh sản phẩm" name="images">
              <UploadFile
                folder="product"
                onImageUpload={handleImageUpload}
                maxCount={3}
                defaultImages={images}
              />
            </Form.Item>
          )}

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Thêm mô tả" />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Thêm giá bán sản phẩm"
            />
          </Form.Item>

          <Form.Item
            label="Giá nhập"
            name="importPrice"
            rules={[{ required: false }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Thêm giá nhập sản phẩm"
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

          {showDiscount && (
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
          )}

          <Form.Item label="Danh mục" name="category">
            <CategorySelect categories={categories} />
          </Form.Item>

          <Form.Item label="Hãng" name="brand">
            <BrandSelect brands={brands} />
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default ProductForm;
