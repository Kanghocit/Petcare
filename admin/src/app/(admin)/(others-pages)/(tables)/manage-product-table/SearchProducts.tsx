"use client";

import { Input } from "antd";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

const SearchProducts = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    // Sync với URL params khi component mount hoặc URL thay đổi từ bên ngoài
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  const updateUrl = (newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update search param
    if (newSearch && newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    // Reset page khi search thay đổi
    params.set("page", "1");

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    router.refresh();
  };

  return (
    <Search
      placeholder="Tìm kiếm sản phẩm"
      allowClear
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onSearch={(value) => {
        updateUrl(value);
      }}
      style={{ width: 250 }}
    />
  );
};

export default SearchProducts;
