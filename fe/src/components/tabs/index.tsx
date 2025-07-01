"use client";
import { useState } from "react";
import ProductCard from "../product-card";

interface TabProps {
  label: string;
  content: {
    img: string[];
    title: string;
    star: number;
    price: number;
    isSale: boolean;
  }[];
}

interface TabsProps {
  tabs: TabProps[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

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
        {tabs[activeTab].content
          ? tabs[activeTab].content?.map((item, index) => (
              <ProductCard
                key={index}
                img={item.img as [string, string]}
                title={item.title}
                star={item.star}
                price={item.price}
                isSale={item.isSale}
              />
            ))
          : "Hết hàng mất rồi bạn ơi"}
      </div>
    </div>
  );
};

export default Tabs;
