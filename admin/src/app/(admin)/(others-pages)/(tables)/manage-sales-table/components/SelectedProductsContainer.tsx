"use client";

import React, { useState, useRef, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { App, Button } from "antd";
import AddDrawer from "./AddDrawer";
import SelectedProducts from "./SelectedProducts";
import FormSaleDetail from "./FormSaleDetail";
import { Product } from "@/interface/Products";
import { createFlashSaleAction, updateFlashSaleAction } from "../action";
import { CreateFlashSaleRequest, FlashSale } from "@/interface/FlashSales";
import type { FormInstance } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

type FieldType = {
  name?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  discountType?: string;
};

const SelectedProductsContainer = ({
  products,
  total,
  action,
  flashSales,
}: {
  products: Product[];
  total: number;
  action: string;
  flashSales: FlashSale;
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<
    Record<string, { discount: number; quantity: number }>
  >({});
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [discountTypeData, setDiscountTypeData] = useState<string>(
    flashSales?.discountType || "percent",
  );
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const formRef = useRef<FormInstance<FieldType> | null>(null);
  const router = useRouter();
  const { message } = App.useApp();

  const handleSubmit = async (values: FieldType) => {
    if (selectedProducts.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    setLoading(true);
    setIsUpdating(true);
    try {
      const flashSaleData: CreateFlashSaleRequest = {
        name: values.name || "",
        startDate: values.startDate?.format("YYYY-MM-DD") || "",
        endDate: values.endDate?.format("YYYY-MM-DD") || "",
        discountType: discountTypeData,
        products: selectedProducts.map((p) => {
          const details = productDetails[p.slug] || {
            discount: 0,
            quantity: 1,
          };
          return {
            productId: p.slug,
            flashSalePrice:
              discountTypeData === "percent"
                ? Math.round(p.price * (1 - details.discount / 100))
                : Math.round(p.price - details.discount),
            quantity: details.quantity,
          };
        }),
      };

      if (action === "edit" && flashSales) {
        await updateFlashSaleAction(flashSales._id!, flashSaleData);
        message.success("Cập nhật chương trình khuyến mại thành công!");
        // Redirect to list page after successful update
        router.push(`/manage-sales-table`);
        router.refresh();
      } else {
        await createFlashSaleAction(flashSaleData);
        message.success("Tạo chương trình khuyến mại thành công!");
        // Reset form for create mode
        setSelectedProducts([]);
        setDiscountTypeData("percent");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo chương trình khuyến mại!");
      console.error(error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  // Prefill data when editing
  useEffect(() => {
    if (flashSales && action === "edit") {
      const fs = flashSales;
      const mapping: Record<string, { discount: number; quantity: number }> =
        {};
      const preselectedProducts: Product[] = [];

      // Map from flash sale products to product details and selected products
      fs.products.forEach((fp) => {
        const prod = fp.productId as unknown as Partial<Product> & {
          slug?: string;
          price?: number;
          title?: string;
          description?: string;
          quantity?: number;
          brand?: string;
          images?: string[];
          status?: string;
          isNewProduct?: boolean;
          isSaleProduct?: boolean;
          star?: number;
        };
        const slug = typeof prod === "string" ? prod : prod?.slug;
        if (slug && typeof prod === "object") {
          const flashPrice = fp.flashSalePrice || 0;
          const qty = fp.quantity || 1;
          const originalPrice = prod.price || 0;

          const discountValue =
            fs.discountType === "percent"
              ? Math.round(((originalPrice - flashPrice) / originalPrice) * 100)
              : Math.max(0, originalPrice - flashPrice);

          mapping[slug] = { discount: discountValue, quantity: qty };

          // Add to preselected products
          preselectedProducts.push({
            slug,
            title: prod.title || "",
            description: prod.description || "",
            price: originalPrice,
            discount: 0,
            status: prod.status || "active",
            quantity: prod.quantity || 0,
            isNewProduct: prod.isNewProduct || false,
            isSaleProduct: prod.isSaleProduct || false,
            star: prod.star || 0,
            brand: prod.brand || "",
            images: prod.images || [],
          } as Product);
        }
      });

      setProductDetails(mapping);
      setSelectedProducts(preselectedProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <ComponentCard
        title="Chọn sản phẩm khuyễn mãi"
        subHeader={
          <>
            <AddDrawer
              onSelect={setSelectedProducts}
              selected={selectedProducts}
              search={search}
              onChangeSearch={setSearch}
              products={products}
              page={page}
              total={total}
            >
              <Button variant="outlined" color="primary">
                Tìm sản phẩm
              </Button>
            </AddDrawer>
          </>
        }
        className="col-span-2"
      >
        <SelectedProducts
          products={selectedProducts}
          discountType={discountTypeData}
          onProductDetailsChange={setProductDetails}
          productDetails={productDetails}
        />
      </ComponentCard>
      <ComponentCard
        title="Thông tin khuyến mãi"
        subHeader={
          <Button
            color="cyan"
            variant="outlined"
            onClick={() => {
              formRef.current?.submit();
            }}
            loading={loading}
          >
            {action === "edit" ? "Cập nhật " : "Tạo "}
          </Button>
        }
      >
        <FormSaleDetail
          discountType={discountTypeData}
          onDiscountTypeChange={setDiscountTypeData}
          onFinish={handleSubmit}
          loading={loading}
          formRef={formRef}
          isUpdating={isUpdating}
          initialValues={
            action === "edit" && flashSales && !isUpdating
              ? {
                  name: flashSales.name,
                  startDate: flashSales.startDate
                    ? dayjs(flashSales.startDate)
                    : undefined,
                  endDate: flashSales.endDate
                    ? dayjs(flashSales.endDate)
                    : undefined,
                }
              : undefined
          }
        />
      </ComponentCard>
    </div>
  );
};

export default SelectedProductsContainer;
