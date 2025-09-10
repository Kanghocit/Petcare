"use client";

import React from "react";
import { Image } from "antd";

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface BrandListProps {
  brands: Brand[];
  selectedLetter: string;
}

const BrandList: React.FC<BrandListProps> = ({ brands, selectedLetter }) => {
  // Group brands by first letter
  const groupedBrands = React.useMemo(() => {
    const groups: { [key: string]: Brand[] } = {};

    brands.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(brand);
    });

    // Sort groups by letter
    const sortedGroups = Object.keys(groups)
      .sort()
      .reduce((result, key) => {
        result[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
        return result;
      }, {} as { [key: string]: Brand[] });

    return sortedGroups;
  }, [brands]);

  // Filter brands based on selected letter
  const filteredGroups = React.useMemo(() => {
    if (selectedLetter === "Tất cả") {
      return groupedBrands;
    }

    if (selectedLetter === "#") {
      // Show brands that start with numbers or special characters
      const numberGroups: { [key: string]: Brand[] } = {};
      Object.keys(groupedBrands).forEach((letter) => {
        if (!/[A-Z]/.test(letter)) {
          numberGroups[letter] = groupedBrands[letter];
        }
      });
      return numberGroups;
    }

    return groupedBrands[selectedLetter]
      ? { [selectedLetter]: groupedBrands[selectedLetter] }
      : {};
  }, [groupedBrands, selectedLetter]);

  return (
    <div className="space-y-8">
      {Object.keys(filteredGroups).map((letter) => (
        <div key={letter} className="flex gap-8 border-b border-gray-200 pb-8">
          {/* Letter header */}
          <div className="w-16 flex-shrink-0">
            <h2 className="text-4xl font-bold text-gray-300 sticky top-4">
              {letter}
            </h2>
          </div>

          {/* Brands grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGroups[letter].map((brand) => (
                <div
                  key={brand.id}
                  className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    {brand.logo && (
                      <div className="w-8 h-8 flex-shrink-0">
                        <Image
                          width={100}
                          height={100}
                          src={
                            brand.logo?.startsWith("http")
                              ? brand.logo
                              : `http://localhost:8000${brand.logo}`
                          }
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <span className="text-gray-800 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(filteredGroups).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy thương hiệu nào bắt đầu bằng &quot;{selectedLetter}
            &quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandList;
