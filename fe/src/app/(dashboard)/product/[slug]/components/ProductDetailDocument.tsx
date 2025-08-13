"use client";

import React, { useState, useRef, useLayoutEffect } from "react";

const COLLAPSED_HEIGHT = 350;

const ProductDetailDocument = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(COLLAPSED_HEIGHT);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const fullHeight = el.scrollHeight;
    setIsOverflowing(fullHeight > COLLAPSED_HEIGHT);
    if (expanded) {
      setMaxHeight(fullHeight);
    } else {
      setMaxHeight(Math.min(COLLAPSED_HEIGHT, fullHeight));
    }
  }, [expanded, description]);

  return (
    <div className="bg-white rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Mô tả sản phẩm</h2>
      <div
        ref={contentRef}
        className="relative transition-all duration-500 ease-in-out"
        style={{
          maxHeight: maxHeight,
          opacity: isOverflowing && !expanded ? 0.95 : 1,
          overflow: "hidden",
          WebkitMaskImage:
            isOverflowing && !expanded
              ? "linear-gradient(180deg, #000 60%, transparent)"
              : undefined,
        }}
      >
        <pre className="whitespace-pre-wrap text-gray-700 text-base font-sans bg-transparent">
          {description}
        </pre>
      </div>
      {isOverflowing && (
        <div className="flex justify-center mt-4">
          <button
            className="px-8 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg shadow transition-all transform ease-in-out hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "THU GỌN" : "XEM THÊM"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailDocument;
