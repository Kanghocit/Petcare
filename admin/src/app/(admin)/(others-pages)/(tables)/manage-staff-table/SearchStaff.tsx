"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

const SearchStaff = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    useEffect(() => {
        router.push(`/manage-staff-table?search=${search}`);
    }, [search, router]);

    return (
        <Search
            placeholder="Tìm kiếm nhân viên"
            allowClear
            onSearch={(value) => {
                setSearch(value);
                router.push(`/manage-staff-table?search=${value}`);
                router.refresh();
            }}
            style={{ width: 250 }}
        />
    );
};

export default SearchStaff;
