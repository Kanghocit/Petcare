"use client";

import React, { useCallback } from "react";
import { Select, Space } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SelectAction: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const pushWithParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(params.toString());
      // Always reset page on filter changes
      next.set("page", "1");
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value.length > 0) next.set(key, value);
        else next.delete(key);
      });
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      router.refresh();
    },
    [params, pathname, router],
  );

  const handleChangePayment = (value?: string) => {
    pushWithParams({ paymentMethod: value });
  };
  const handleChangeFulfillmentStatus = (value?: string) => {
    pushWithParams({ fulfillmentStatus: value });
  };
  const handleChangePaymentStatus = (value?: string) => {
    pushWithParams({ paymentStatus: value });
  };

  return (
    <>
      <Space wrap>
        <Select
          placeholder="Phương thức thanh toán"
          style={{ width: 200 }}
          defaultValue={params.get("paymentMethod") || undefined}
          onChange={handleChangePayment}
          allowClear
          options={[
            { value: "cod", label: "Tiền mặt" },
            { value: "momo", label: "Momo" },
            { value: "vnpay", label: "Vnpay" },
          ]}
        />
        <Select
          placeholder="Trạng thái thanh toán"
          style={{ width: 200 }}
          defaultValue={params.get("paymentStatus") || undefined}
          onChange={handleChangePaymentStatus}
          allowClear
          options={[
            { value: "unpaid", label: "Chưa thanh toán" },
            { value: "paid", label: "Đã thanh toán" },
            { value: "refunded", label: "Đã hoàn tiền" },
          ]}
        />
        <Select
          placeholder="Trạng thái đơn hàng"
          style={{ width: 200 }}
          defaultValue={params.get("fulfillmentStatus") || undefined}
          onChange={handleChangeFulfillmentStatus}
          allowClear
          options={[
            { value: "unfulfilled", label: "Chưa xử lý" },
            { value: "processing", label: "Đang xử lý" },
            { value: "shipping", label: "Bắt đầu giao" },
            { value: "shipped", label: "Đã giao hàng" },
            { value: "delivered", label: "Đã nhận hàng" },
            { value: "returned", label: "Đã trả hàng" },
            { value: "cancelled", label: "Đã hủy" },
          ]}
        />
      </Space>
    </>
  );
};

export default SelectAction;
