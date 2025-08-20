"use client";

import React from "react";
import { useState } from "react";
import useCheckoutStore from "@/store/checkout-store";

type AddressProp = { address: string };

const MethodReceipt: React.FC<AddressProp> = ({ address }) => {
  const [method, setMethod] = useState<"home" | "store">("home");
  //   const [newAddress, setNewAddress] = useState();
  const setReceiptMethod = useCheckoutStore((s) => s.setReceiptMethod);
  const setAddress = useCheckoutStore((s) => s.setAddress);

  React.useEffect(() => {
    setAddress(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
      <h3 className="text-base font-semibold mb-3">PHƯƠNG THỨC NHẬN HÀNG</h3>
      <div className="flex gap-3 mb-4">
        <button
          className={`flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg border ${
            method === "home" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => {
            setMethod("home");
            setReceiptMethod("home");
          }}
        >
          <span className="text-xl">🚚</span>
          Giao hàng tận nhà
        </button>
        <button
          className={`flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg border ${
            method === "store"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => {
            setMethod("store");
            setReceiptMethod("store");
          }}
        >
          <span className="text-xl">🏬</span>
          Nhận hàng tại cửa hàng
        </button>
      </div>
      {method === "home" && (
        <div className="text-sm">
          <div className="text-gray-500 mb-1">Địa chỉ nhận hàng:</div>
          <div className="flex items-center justify-between">
            <div className="font-medium">{address}</div>
            <button className="text-blue-600 hover:underline">Thay đổi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodReceipt;
