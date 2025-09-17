"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { InputNumber, Table } from "antd";
import type { TableProps } from "antd";
import { Product } from "@/interface/Products";

interface SelectedProductsProps {
  products: Product[];
  discountType: string;
  onProductDetailsChange: (
    details: Record<string, { discount: number; quantity: number }>,
  ) => void;
  productDetails: Record<string, { discount: number; quantity: number }>;
}

type RowType = {
  key: string;
  name: string;
  price: number;
  discount: number;
  newPrice: number;
  quantity: number;
};

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  products,
  discountType,
  onProductDetailsChange,
  productDetails,
}) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const prevRowsRef = useRef<RowType[]>([]);

  useEffect(() => {
    const mapped: RowType[] = (products || []).map((p) => ({
      key: p.slug,
      name: p.title,
      price: p.price,
      discount: productDetails[p.slug]?.discount || 0,
      newPrice: (() => {
        const discount = productDetails[p.slug]?.discount || 0;
        return discountType === "percent"
          ? Math.max(0, Math.round(p.price * (1 - discount / 100)))
          : Math.max(0, Math.round(p.price - discount));
      })(),
      quantity: productDetails[p.slug]?.quantity || 1,
    }));
    setRows(mapped);
  }, [products, productDetails, discountType]);

  // Update rows when discountType changes
  useEffect(() => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        newPrice: Math.max(
          0,
          discountType === "percent"
            ? Math.round(row.price * (1 - row.discount / 100))
            : Math.round(row.price - row.discount),
        ),
      })),
    );
  }, [discountType]);

  // Update parent with product details when rows change
  useEffect(() => {
    // Only update if rows actually changed
    if (
      rows.length > 0 &&
      JSON.stringify(rows) !== JSON.stringify(prevRowsRef.current)
    ) {
      const details: Record<string, { discount: number; quantity: number }> =
        {};
      rows.forEach((row) => {
        details[row.key] = {
          discount: row.discount,
          quantity: row.quantity,
        };
      });
      onProductDetailsChange(details);
      prevRowsRef.current = rows;
    }
  }, [rows, onProductDetailsChange]);

  const columns: TableProps<RowType>["columns"] = useMemo(
    () => [
      { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
      {
        title: "Giá bán",
        dataIndex: "price",
        key: "price",
        render: (value: number) => `${(value || 0).toLocaleString()}đ`,
      },
      {
        title: discountType === "percent" ? "Giảm %" : "Giảm tiền",
        dataIndex: "discount",
        key: "discount",
        render: (_: number, record) => (
          <InputNumber
            min={0}
            max={discountType === "percent" ? 100 : undefined}
            value={record.discount}
            addonAfter={discountType === "percent" ? "%" : "đ"}
            onChange={(val) => {
              const discount = Number(val || 0);
              setRows((prev) =>
                prev.map((r) =>
                  r.key === record.key
                    ? {
                        ...r,
                        discount,
                        newPrice:
                          discountType === "percent"
                            ? Math.round(r.price * (1 - discount / 100))
                            : Math.round(r.price - discount),
                      }
                    : r,
                ),
              );
            }}
          />
        ),
      },
      {
        title: discountType === "percent" ? "Giá mới" : "Giá sau giảm",
        dataIndex: "newPrice",
        key: "newPrice",
        render: (value: number) => `${(value || 0).toLocaleString("vi-VN")}đ`,
      },
      {
        title: discountType === "percent" ? "Số lượng" : "Số lượng sau giảm",
        dataIndex: "quantity",
        key: "quantity",
        render: (_: number, record) => (
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(val) =>
              setRows((prev) =>
                prev.map((r) =>
                  r.key === record.key
                    ? { ...r, quantity: Number(val || 1) }
                    : r,
                ),
              )
            }
          />
        ),
      },
    ],
    [discountType],
  );

  return (
    <Table<RowType> columns={columns} dataSource={rows} pagination={false} />
  );
};

export default SelectedProducts;
