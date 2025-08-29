"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

const SearchVoicher = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    router.push(`/manage-voicher-table?search=${search}`);
  }, [search, router]);

  return (
    <Search
      placeholder="Tìm kiếm voichers"
      allowClear
      onSearch={(value) => {
        setSearch(value);
        router.push(`/manage-voicher-table?search=${value}`);
        router.refresh();
      }}
      style={{ width: 250 }}
    />
  );
};

export default SearchVoicher;
