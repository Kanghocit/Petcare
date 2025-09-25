"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

const SearchCategory = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    router.push(`/manage-category-table?search=${search}`);
  }, [search, router]);

  return (
    <Search
      placeholder="Tìm kiếm sản phẩm"
      allowClear
      onSearch={(value) => {
        setSearch(value);
        router.push(`/manage-category-table?search=${value}`);
        router.refresh();
      }}
      style={{ width: 250 }}
    />
  );
};

export default SearchCategory;
