"use client";

import React, { useState } from "react";
import AlphabetFilter from "@/components/brands/AlphabetFilter";
import BrandList from "@/components/brands/BrandList";
import { mockBrands } from "@/data/brands";

const BrandFilter = () => {
  const [selectedLetter, setSelectedLetter] = useState("Tất cả");

  return (
    <>
      <div className="mb-8">
        <AlphabetFilter
          selectedLetter={selectedLetter}
          onLetterChange={setSelectedLetter}
        />
      </div>

      {/* Brand List */}
      <div className="mx-auto">
        <BrandList brands={mockBrands} selectedLetter={selectedLetter} />
      </div>
    </>
  );
};

export default BrandFilter;
