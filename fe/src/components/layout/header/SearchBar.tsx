"use client";

import { SearchOutlined } from "@ant-design/icons";

const SearchBar: React.FC = () => (
  <div className="flex justify-between items-center border-1 border-gray-300 rounded-full min-w-[500px] text-xl">
    <input
      type="text"
      placeholder="Tìm kiếm sản phẩm..."
      className="focus:outline-none min-w-[600px] ps-5 py-4 cursor-text text-gray-500 mx-2"
    />
    <button className="bg-[#ff8662] text-white py-4 px-7 rounded-r-full hover:bg-[#ff8662]/80 cursor-pointer">
      <SearchOutlined size={30} />
    </button>
  </div>
);

export default SearchBar;
