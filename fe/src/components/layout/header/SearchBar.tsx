"use client";

import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { App } from "antd";
import clsx from "clsx";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync với URL params nếu đang ở trang products
  const urlQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync state với URL khi URL thay đổi
  useEffect(() => {
    if (pathname === "/products") {
      setSearchTerm(urlQuery);
    } else {
      setSearchTerm("");
    }
  }, [urlQuery, pathname]);

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      message.warning("Vui lòng nhập từ khóa tìm kiếm");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length < 2) {
      message.warning("Vui lòng nhập ít nhất 2 ký tự");
      inputRef.current?.focus();
      return;
    }

    setShowSuggestions(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
    setShowSuggestions(true);
    // Nếu đang ở trang products, xóa query param
    if (pathname === "/products") {
      router.push("/products");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ESC để clear
    if (e.key === "Escape") {
      handleClear();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    router.push(`/products?q=${encodeURIComponent(suggestion)}`);
  };

  const hasValue = searchTerm.trim().length > 0;

  return (
    <div className="relative flex-1 max-w-2xl mx-4 lg:mx-8">
      <form
        onSubmit={handleSearch}
        className={clsx(
          "flex items-center bg-white border-2 rounded-full transition-all duration-200 shadow-sm",
          isFocused
            ? "border-orange-400 shadow-md"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <div className="flex items-center flex-1 relative">
          <SearchOutlined className="absolute left-4 text-gray-400 text-lg pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (!hasValue) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
              if (e.key === "Enter") {
                setShowSuggestions(false);
              }
            }}
            className="w-full pl-12 pr-10 py-2.5 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent rounded-l-full"
          />
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <CloseOutlined className="text-sm" />
            </button>
          )}
        </div>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            performSearch();
          }}
          className="flex items-center justify-center px-5 sm:px-7 py-2.5 rounded-r-full bg-[#ff8662] text-white hover:bg-[#ff8662]/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
          aria-label="Tìm kiếm"
        >
          <SearchOutlined className="text-lg" />
          <span className="ml-2 hidden sm:inline text-base">Tìm</span>
        </button>
      </form>

      {/* Search tips khi focus và empty */}
      {showSuggestions && !hasValue && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Gợi ý tìm kiếm:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Thức ăn cho chó", "Thức ăn cho mèo", "Đồ chơi", "Phụ kiện"].map(
              (tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSuggestionClick(tip);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-full transition-colors cursor-pointer active:scale-95"
                >
                  {tip}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
