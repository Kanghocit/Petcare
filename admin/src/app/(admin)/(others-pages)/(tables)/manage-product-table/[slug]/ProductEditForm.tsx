"use client";

import React, { useState } from "react";
import { App } from "antd";
import { Product } from "@/interface/Products";
import { useRouter } from "next/navigation";
import { UpdateProductAction } from "../action";
import ProductForm from "@/components/form/ProductForm";
import { Brand } from "@/interface/Brand";

interface ProductEditFormProps {
  product: Product;
  brands: { brands: Brand[]; total: number };
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  brands,
}) => {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Product) => {
    setLoading(true);
    try {
      const res = await UpdateProductAction(product.slug, values);
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
    <ProductForm
      product={product}
      brands={brands}
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Lưu"
      showImages={true}
      showVideos={true}
      showRelated={true}
      layout="vertical"
      onCancel={() => router.back()}
    />
  );
};

export default ProductEditForm;
