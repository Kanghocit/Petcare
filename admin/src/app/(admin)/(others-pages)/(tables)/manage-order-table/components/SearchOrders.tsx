"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

const SearchOrders = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = search
      ? `/manage-order-table?search=${encodeURIComponent(search)}`
      : `/manage-order-table`;
    router.push(url);
  }, [search, router]);

  return (
    <Search
      placeholder="Tìm kiếm theo mã, tên"
      allowClear
      onSearch={(value) => {
        setSearch(value.trim());
        const url = value.trim()
          ? `/manage-order-table?search=${encodeURIComponent(value.trim())}`
          : `/manage-order-table`;
        router.push(url);
        router.refresh();
      }}
      style={{ width: 250 }}
    />
  );
};

export default SearchOrders;
