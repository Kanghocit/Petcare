"use client";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleButtonClick = () => {
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-between items-center border-1 border-gray-300 rounded-full min-w-[500px] text-xl mx-20"
    >
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="focus:outline-none min-w-[600px] ps-5 py-2 cursor-text text-gray-500 mx-2"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-[#ff8662] text-white py-2 px-6 rounded-r-full hover:bg-[#ff8662]/80 cursor-pointer"
      >
        <SearchOutlined size={30} />
      </button>
    </form>
  );
};

export default SearchBar;
