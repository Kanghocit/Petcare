"use client";

import React, { useEffect, useState } from "react";
import useCheckoutStore from "@/store/checkout-store";

type AddressProp = {
  address: string; // có thể mở rộng thành object nếu cần
};

const MethodReceipt: React.FC<AddressProp> = ({ address }) => {
  const [method, setMethod] = useState<"home" | "store">("home");
  const [isEditing, setIsEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const setReceiptMethod = useCheckoutStore((s) => s.setReceiptMethod);
  const setAddress = useCheckoutStore((s) => s.setAddress);

  // Đồng bộ method khi thay đổi
  useEffect(() => {
    setReceiptMethod(method);
    setAddress(method === "store" ? "store" : tempAddress);
  }, [method, tempAddress, setReceiptMethod, setAddress]);

  const handleSaveAddress = () => {
    setAddress(tempAddress);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
      <h3 className="text-base font-semibold mb-3">PHƯƠNG THỨC NHẬN HÀNG</h3>

      {/* --- Chọn phương thức --- */}
      <div className="flex gap-3 mb-4">
        <button
          className={`flex w-full justify-center cursor-pointer items-center gap-2 px-4 py-2 rounded-lg border transition ${
            method === "home"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
          onClick={() => setMethod("home")}
        >
          <span className="text-xl">🚚</span>
          Giao hàng tận nhà
        </button>

        <button
          className={`flex w-full justify-center cursor-pointer items-center gap-2 px-4 py-2 rounded-lg border transition ${
            method === "store"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
          onClick={() => setMethod("store")}
        >
          <span className="text-xl">🏬</span>
          Nhận tại cửa hàng
        </button>
      </div>

      {/* --- Nếu chọn giao hàng tận nhà --- */}
      {method === "home" && (
        <div className="text-sm">
          <div className="text-gray-500 mb-1">Địa chỉ nhận hàng:</div>

          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
              <button
                className="text-blue-600 hover:underline text-sm cursor-pointer"
                onClick={handleSaveAddress}
              >
                Lưu
              </button>
              <button
                className="text-gray-500 hover:underline text-sm cursor-pointer "
                onClick={() => {
                  setTempAddress(address);
                  setIsEditing(false);
                }}
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{tempAddress}</p>
              <button
                className="text-blue-600 hover:underline text-sm cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Thay đổi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MethodReceipt;
