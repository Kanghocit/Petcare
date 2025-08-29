"use client";

import React, { useState } from "react";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Collapse, Slider, Input, Checkbox, Button, Tag } from "antd";

const { Panel } = Collapse;

const COLORS = [
  "Red",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Orange",
  "Blue",
  "Pink",
  "Purple",
  "Grey",
  "Dual Tone",
  "Brown",
];

const BRANDS = [
  "Royal Canin",
  "Snappy Tom",
  "Catsrang",
  "Moochie",
  "Kucinta",
  "Catchy",
  "Apro",
];

const STATUS = ["In stock", "Out of stock"];

const ProductsFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 299.99]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState("");

  const toggleItem = (
    item: string,
    list: string[],
    setList: (list: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedStatus([]);
    setPriceRange([0, 299.99]);
  };

  const filteredColors = COLORS.filter((color) =>
    color.toLowerCase().includes(colorSearch.toLowerCase())
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    selectedStatus.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 299.99;

  const renderActiveFilters = () => {
    const items = [
      ...selectedBrands.map((b) => ({ type: "Brand", value: b })),
      ...selectedColors.map((c) => ({ type: "Color", value: c })),
      ...selectedStatus.map((s) => ({ type: "Size", value: s })),
    ];

    if (priceRange[0] !== 0 || priceRange[1] !== 299.99) {
      items.push({
        type: "Price",
        value: `$${priceRange[0].toFixed(2)} - $${priceRange[1].toFixed(2)}`,
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
                toggleItem(item.value, selectedBrands, setSelectedBrands);
              else if (item.type === "Color")
                toggleItem(item.value, selectedColors, setSelectedColors);
              else if (item.type === "Size")
                toggleItem(item.value, selectedStatus, setSelectedStatus);
              else if (item.type === "Price") setPriceRange([0, 299.99]);
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
          defaultActiveKey={["price", "color"]}
          ghost
          expandIconPosition="end"
          className="border-none"
        >
          {/* Price Filter */}
          <Panel
            header={<span className="font-medium">Price</span>}
            key="price"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <div className="text-sm text-gray-600 mb-3">
                Range: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
              </div>
              <Slider
                range
                min={0}
                max={299.99}
                step={0.01}
                value={priceRange}
                onChange={setPriceRange}
                className="w-full"
              />
            </div>
          </Panel>

          {/* Color Filter */}
          <Panel
            header={<span className="font-medium ">Color</span>}
            key="color"
            className="border-b border-gray-100"
          >
            <div>
              <Input
                placeholder="Search colors..."
                prefix={<SearchOutlined className="text-blue-500" />}
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                size="large"
                className="mb-3 rounded-xl border border-gray-300 bg-gray-50 
             hover:bg-white focus-within:border-blue-500 focus-within:ring-2 
             focus-within:ring-blue-200 transition-all"
              />

              <div className="text-sm text-gray-600 mb-3">
                Showing {filteredColors.length} of {COLORS.length} options
              </div>
              <div className="space-y-2 overflow-y-auto">
                {filteredColors.map((color) => (
                  <Checkbox
                    key={color}
                    checked={selectedColors.includes(color)}
                    onChange={() =>
                      toggleItem(color, selectedColors, setSelectedColors)
                    }
                    className="w-full"
                  >
                    {color}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Panel>

          {/* Size Filter */}
          <Panel
            header={<span className="font-medium">Status</span>}
            key="status"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <div className="flex flex-col gap-2">
                {STATUS.map((status) => (
                  <Checkbox
                    key={status}
                    checked={selectedStatus.includes(status)}
                    onChange={() =>
                      toggleItem(status, selectedStatus, setSelectedStatus)
                    }
                  >
                    {status}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Panel>

          {/* Brand Filter */}
          <Panel
            header={<span className="font-medium">Brand</span>}
            key="brand"
            className="border-b border-gray-100"
          >
            <div className="py-2">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {BRANDS.map((brand) => (
                  <Checkbox
                    key={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() =>
                      toggleItem(brand, selectedBrands, setSelectedBrands)
                    }
                    className="w-full"
                  >
                    {brand}
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
