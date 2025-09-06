"use client";

import React from "react";
import { Select } from "antd";
import { Brand } from "@/interface/Brand";

interface BrandSelectProps {
  brands: { brands: Brand[]; total: number };
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  brands,
  placeholder = "Chọn hãng sản phẩm",
  style = { width: "100%" },
  value,
  onChange,
}) => {
  return (
    <Select
      style={style}
      value={value}
      onChange={onChange}
      options={
        brands?.brands?.map((item: Brand) => ({
          value: item.name,
          label: item.name,
        })) || []
      }
      placeholder={placeholder}
    />
  );
};

export default BrandSelect;
