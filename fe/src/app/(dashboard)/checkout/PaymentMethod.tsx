"use client";

import React from "react";
import useCheckoutStore from "@/store/checkout-store";

const PaymentMethod: React.FC = () => {
  const [method, setMethod] = React.useState<"cod" | "momo" | "vnpay">("cod");
  const [note, setNote] = React.useState("");
  const [invoice, setInvoice] = React.useState(false);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setNoteStore = useCheckoutStore((s) => s.setNote);
  const setInvoiceStore = useCheckoutStore((s) => s.setInvoice);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
      <h3 className="text-base font-semibold mb-3">HÌNH THỨC THANH TOÁN</h3>
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={method === "cod"}
            onChange={() => {
              setMethod("cod");
              setPaymentMethod("cod");
            }}
          />
          Thanh toán tiền mặt khi nhận hàng (COD)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={method === "momo"}
            onChange={() => {
              setMethod("momo");
              setPaymentMethod("momo");
            }}
          />
          Thanh toán bằng Ví MoMo
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={method === "vnpay"}
            onChange={() => {
              setMethod("vnpay");
              setPaymentMethod("vnpay");
            }}
          />
          Thanh toán bằng Ví VNPAY
        </label>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">Ghi chú</div>
        <textarea
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          placeholder="Nhập ghi chú cần lưu ý khi chuyển hàng"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteStore(e.target.value);
          }}
        />
      </div>

      <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={invoice}
          onChange={(e) => {
            setInvoice(e.target.checked);
            setInvoiceStore(e.target.checked);
          }}
        />
        Tôi muốn xuất hóa đơn đỏ
      </label>
    </div>
  );
};

export default PaymentMethod;
