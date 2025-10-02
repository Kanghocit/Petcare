"use client";

import React, { useMemo, useState } from "react";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Collapse, Slider, Input, Checkbox, Button, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { Brand } from "@/interface/brand";

const { Panel } = Collapse;

const VND_MAX = 1_000_000;

const ProductsFilter = ({ brands }: { brands: Brand[] }) => {
  const [priceRange, setPriceRange] = useState([0, VND_MAX]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  // const [colorSearch, setColorSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isNewChecked = searchParams.get("isNewProduct") != null;
  const isSaleChecked = searchParams.get("isSaleProduct") != null;

  const formatVND = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  const pushParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(href, { scroll: false });
  };

  const setBooleanParam = (key: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) params.set(key, "1");
    else params.delete(key);
    pushParams(params);
  };

  const updateQueryParams = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((v) => params.append(key, v));
    pushParams(params);
  };

  const updatePriceParams = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min === 0 && max === VND_MAX) {
      params.delete("price_min");
      params.delete("price_max");
    } else {
      params.set("price_min", String(Math.round(min)));
      params.set("price_max", String(Math.round(max)));
    }
    pushParams(params);
  };

  const toggleItem = (
    item: string,
    list: string[],
    setList: (list: string[]) => void,
    key: string
  ) => {
    const nextList = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    setList(nextList);
    updateQueryParams(key, nextList);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setPriceRange([0, VND_MAX]);

    const params = new URLSearchParams(searchParams.toString());
    [
      "brand",
      "color",
      "isNewProduct",
      "isSaleProduct",
      "price_min",
      "price_max",
    ].forEach((k) => params.delete(k));
    pushParams(params);
  };

  // const filteredColors = COLORS.filter((color) =>
  //   color.toLowerCase().includes(colorSearch.toLowerCase())
  // );

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    isNewChecked ||
    isSaleChecked ||
    priceRange[0] !== 0 ||
    priceRange[1] !== VND_MAX;

  const renderActiveFilters = () => {
    const items = [
      ...selectedBrands.map((b) => ({ type: "Brand", value: b })),
      ...selectedColors.map((c) => ({ type: "Color", value: c })),
      ...(isNewChecked
        ? [{ type: "isNewProduct", value: "Sản phẩm mới" }]
        : []),
      ...(isSaleChecked
        ? [{ type: "isSaleProduct", value: "Đang giảm giá" }]
        : []),
    ];

    if (priceRange[0] !== 0 || priceRange[1] !== VND_MAX) {
      items.push({
        type: "Price",
        value: `${formatVND.format(priceRange[0])} - ${formatVND.format(
          priceRange[1]
        )}`,
      });
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <Tag
            key={idx}
            closable
            onClose={(e) => {
              e.preventDefault();
              if (item.type === "Brand")
                toggleItem(
                  item.value,
                  selectedBrands,
                  setSelectedBrands,
                  "brand"
                );
              else if (item.type === "Color")
                toggleItem(
                  item.value,
                  selectedColors,
                  setSelectedColors,
                  "color"
                );
              else if (item.type === "isNewProduct")
                setBooleanParam("isNewProduct", false);
              else if (item.type === "isSaleProduct")
                setBooleanParam("isSaleProduct", false);
              else if (item.type === "Price") {
                setPriceRange([0, VND_MAX]);
                updatePriceParams(0, VND_MAX);
              }
            }}
            className="text-sm"
          >
            {item.value}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          {hasActiveFilters && (
            <Button
              type="text"
              size="small"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Active Filters:</div>
          {renderActiveFilters()}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <Collapse
          ghost
          defaultActiveKey={["price", "brand", "flags"]}
          expandIconPosition="end"
          className="border-none"
        >
          {/* Price Filter */}
          <Panel
            header={<span className="font-medium">Giá</span>}
            key="price"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <div className="text-sm text-gray-600 mb-3">
                Khoảng giá: {formatVND.format(priceRange[0])} -{" "}
                {formatVND.format(priceRange[1])}
              </div>
              <Slider
                range
                min={0}
                max={VND_MAX}
                step={1000}
                value={priceRange}
                onChange={(v) => setPriceRange(v as [number, number])}
                onAfterChange={(v) => {
                  const [min, max] = v as [number, number];
                  updatePriceParams(min, max);
                }}
                className="w-full"
              />
            </div>
          </Panel>

          {/* Flags Filter */}
          <Panel
            header={<span className="font-medium">Tình trạng</span>}
            key="flags"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <div className="flex flex-col gap-2">
                <Checkbox
                  checked={isNewChecked}
                  onChange={(e) =>
                    setBooleanParam("isNewProduct", e.target.checked)
                  }
                  className="w-full"
                >
                  Sản phẩm mới
                </Checkbox>
                <Checkbox
                  checked={isSaleChecked}
                  onChange={(e) =>
                    setBooleanParam("isSaleProduct", e.target.checked)
                  }
                  className="w-full"
                >
                  Đang giảm giá
                </Checkbox>
              </div>
            </div>
          </Panel>

          {/* Color Filter
          <Panel
            header={<span className="font-medium ">Màu sắc</span>}
            key="color"
            className="border-b border-gray-100"
          >
            <div>
              <Input
                placeholder="Tìm kiếm màu sắc..."
                prefix={<SearchOutlined className="text-blue-500" />}
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                size="large"
                className="mb-3 rounded-xl border border-gray-300 bg-gray-50 
             hover:bg-white focus-within:border-blue-500 focus-within:ring-2 
             focus-within:ring-blue-200 transition-all"
              />

              <div className="text-sm text-gray-600 mb-3">
                Hiển thị {filteredColors.length} trên {COLORS.length} màu sắc
              </div>
              <div className="space-y-2 overflow-y-auto">
                {filteredColors.map((color) => (
                  <Checkbox
                    key={color}
                    checked={selectedColors.includes(color)}
                    onChange={() =>
                      toggleItem(
                        color,
                        selectedColors,
                        setSelectedColors,
                        "color"
                      )
                    }
                    className="w-full"
                  >
                    {color}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Panel> */}

          {/* Brand Filter */}
          <Panel
            header={<span className="font-medium">Thương hiệu</span>}
            key="brand"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <Input
                placeholder="Tìm kiếu thương hiệu..."
                prefix={<SearchOutlined className="text-blue-500" />}
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                size="large"
                className="mb-3 rounded-xl border border-gray-300 bg-gray-50 
             hover:bg-white focus-within:border-blue-500 focus-within:ring-2 
             focus-within:ring-blue-200 transition-all"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredBrands.map((brand) => (
                  <Checkbox
                    key={brand._id}
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() =>
                      toggleItem(
                        brand.name,
                        selectedBrands,
                        setSelectedBrands,
                        "brand"
                      )
                    }
                    className="w-full"
                  >
                    {brand.name}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ProductsFilter;
