"use client";

import React from "react";
import useCheckoutStore from "@/store/checkout-store";
import { Collapse } from "antd";
import type { CollapseProps } from "antd";

const PaymentMethod: React.FC = () => {
  const [activeKey, setActiveKey] = React.useState<string>("3");
  const [note, setNote] = React.useState("");
  const [invoice, setInvoice] = React.useState(false);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setNoteStore = useCheckoutStore((s) => s.setNote);
  const setInvoiceStore = useCheckoutStore((s) => s.setInvoice);

  const keyToMethod: Record<string, "cod" | "momo" | "ck"> = {
    "1": "momo", // OnePAY - Credit/ATM
    "2": "cod", // Thanh toán khi nhận hàng
    "3": "ck", // Chuyển khoản ngân hàng / ví
  };

  const bankInfo = (
    <div className="text-sm text-gray-700 leading-relaxed">
      <p className="mb-1">
        Quý Khách Hàng vui lòng chuyển khoản theo thông tin bên dưới
      </p>
      <p>Tài khoản MB Bank (Ngân Hàng Quân Đội)</p>
      <p>
        STK: <strong>8565618052003</strong>
      </p>
      <p>
        Tên TK: <strong>BUI AN KHANG</strong>
      </p>
      <p>
        Nội dung: <strong>Tên Người Mua Hàng + Số Điện Thoại</strong>
      </p>
    </div>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      className: "bg-white",
      label: (
        <div className="flex items-center gap-2">
          <input type="radio" readOnly checked={activeKey === "1"} />
          <span>Thanh toán qua ví MoMo</span>
        </div>
      ),
      children: (
        <div className="text-sm text-gray-600 flex flex-col items-center justify-center text-center px-6 ">
          Sau khi nhấp vào “Đặt mua”, bạn sẽ được chuyển hướng đến MoMo để
          Credit/ATM card/QR để hoàn tất việc mua hàng một cách an toàn.
        </div>
      ),
    },
    {
      key: "2",
      className: "bg-white",
      label: (
        <div className="flex items-center gap-2">
          <input type="radio" readOnly checked={activeKey === "2"} />
          <span>Thanh toán khi nhận hàng (COD)</span>
        </div>
      ),
      children: (
        <div className="text-sm text-gray-600 flex flex-col items-center justify-center text-center px-6 ">
          Quý khách thanh toán tiền mặt khi nhận hàng.
        </div>
      ),
    },
    {
      key: "3",
      className: "bg-white",
      label: (
        <div className="flex items-center gap-2">
          <input type="radio" readOnly checked={activeKey === "3"} />
          <span>Chuyển Khoản Ngân Hàng</span>
        </div>
      ),
      children: bankInfo,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
      <h3 className="text-base font-semibold mb-3">Thanh toán</h3>

      <Collapse
        items={items}
        bordered={false}
        accordion
        className="bg-white"
        activeKey={[activeKey]}
        expandIcon={() => null}
        onChange={(key) => {
          const k = Array.isArray(key) ? key[0] : (key as string | undefined);
          if (!k) return;
          setActiveKey(k);
          const m = keyToMethod[k];
          if (m) setPaymentMethod(m);
        }}
      />

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
