"use client";
import { useState } from "react";
import ProductCard from "../product-card";
import { Product } from "@/interface/product";

interface TabProps {
  label: string;
  key: string;
}

interface TabsProps {
  tabs: TabProps[];
  catFoodData: Product[];
  dogFoodData: Product[];
  toysData: Product[];
}

const Tabs = ({ tabs, catFoodData, dogFoodData, toysData }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  // Function to get data based on active tab
  const getCurrentData = () => {
    const currentTab = tabs[activeTab];
    if (!currentTab) return [];

    switch (currentTab.key) {
      case "cat-food":
        return catFoodData;
      case "dog-food":
        return dogFoodData;
      case "toys":
        return toysData;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Tab Header */}
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-3xl font-semibold transition ${
              index === activeTab
                ? "bg-orange-400 text-white"
                : "bg-white text-[#ff9167] hover:text-[#f25921]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {currentData && currentData.length > 0
          ? currentData.map((item, index) => (
              <ProductCard
                key={item._id || index}
                id={String(item._id)}
                img={item.images as [string, string]}
                title={item.title}
                star={item.star}
                discount={item.discount}
                salePrice={item.price * (1 - item.discount / 100)}
                price={item.price}
                isSale={item.isSaleProduct}
                slug={item.slug}
              />
            ))
          : "Hết hàng mất rồi bạn ơi"}
      </div>
    </div>
  );
};

export default Tabs;
