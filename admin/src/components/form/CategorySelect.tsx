"use client";

import React from "react";
import { Select } from "antd";
import { Category } from "@/interface/Category";

interface CategorySelectProps {
  categories: { categories: Category[]; total: number };
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  placeholder = "Chọn danh mục sản phẩm",
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
        categories?.categories?.map((item: Category) => ({
          value: item.name,
          label: item.name,
        })) || []
      }
      placeholder={placeholder}
    />
  );
};

export default CategorySelect;
