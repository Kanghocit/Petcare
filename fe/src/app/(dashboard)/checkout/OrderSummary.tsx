"use client";

import React, { useEffect, useMemo, useState } from "react";
import useCartStore from "@/store/cart-store";
import useCheckoutStore from "@/store/checkout-store";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import { createOrderAction } from "./action";
import { CreateOrderPayload } from "@/libs/order";
import { App } from "antd";
import { useRouter } from "next/navigation";

const DiscountInput: React.FC = () => {
  const [code, setCode] = useState("");
  const setDiscount = useCheckoutStore((s) => s.setDiscount);
  const appliedCode = useCheckoutStore((s) => s.discountCode);
  const appliedAmount = useCheckoutStore((s) => s.discountAmount) || 0;

  useEffect(() => {
    if (appliedCode) setCode(appliedCode);
  }, [appliedCode]);

  const apply = () => {
    // Simple demo rule: 50K or 100K
    const normalized = code.trim().toUpperCase();
    const amount =
      normalized === "50K" ? 50000 : normalized === "100K" ? 100000 : 0;
    setDiscount(
      amount > 0 ? normalized : undefined,
      amount > 0 ? amount : undefined
    );
  };

  const clear = () => setDiscount(undefined, undefined);

  return (
    <div className="flex items-center gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Nhập mã"
        className="border rounded px-2 py-1 text-sm w-28 text-right"
      />
      {appliedAmount > 0 ? (
        <button onClick={clear} className="text-red-500 text-sm">
          Bỏ
        </button>
      ) : (
        <button onClick={apply} className="text-blue-600 text-sm">
          Áp dụng
        </button>
      )}
    </div>
  );
};

const OrderSummary: React.FC = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const totalFromStore = useCartStore((s) => s.total)();
  const clearCart = useCartStore((state) => state.clearCart);

  const [cartFromStorage, setCartFromStorage] = useState<typeof cart>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("petcare-cart");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const stored = parsed?.state?.cart ?? [];
      if (Array.isArray(stored)) setCartFromStorage(stored);
    } catch {
      // ignore parse errors
    }
  }, []);

  const effectiveCart = cart.length > 0 ? cart : cartFromStorage;
  const subtotal = useMemo(() => {
    if (cart.length > 0) return totalFromStore;
    return effectiveCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart.length, totalFromStore, effectiveCart]);

  const shippingFee = effectiveCart.length > 0 ? 30000 : 0;
  const discountCode = useCheckoutStore((s) => s.discountCode);
  const discountAmount = useCheckoutStore((s) => s.discountAmount) || 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const {
    fullName,
    email,
    phone,
    address,
    receiptMethod,
    paymentMethod,
    note,
    invoice,
  } = useCheckoutStore(
    useShallow((s) => ({
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      address: s.address,
      receiptMethod: s.receiptMethod,
      paymentMethod: s.paymentMethod,
      note: s.note,
      invoice: s.invoice,
    }))
  );

  const handlePlaceOrder = async () => {
    const items = effectiveCart.map((i) => ({
      product: i.id,
      quantity: i.quantity,
      priceAtPurchase: i.price,
      image: i.img,
      name: i.name,
    }));

    const payload = {
      items,
      shippingAddress: {
        fullName: fullName || "",
        phone: phone || "",
        email: email || "",
        address: address || "",
      },
      shipping: {
        method: receiptMethod === "home" ? "standard" : "express",
        fee: shippingFee,
        notes: note,
      },
      payment: { method: paymentMethod },
      note,
      discount: discountCode
        ? { code: discountCode, amount: discountAmount, type: "fixed" }
        : undefined,
      source: "web",
      invoice,
      totals: { subtotal, shippingFee, grandTotal },
    } as CreateOrderPayload;

    try {
      const result = await createOrderAction(payload);
      if (result.ok) {
        const msg =
          (result.body as { message?: string })?.message ||
          "Đặt hàng thành công";
        message.success(msg);
        clearCart();
        router.push("/profile/orders");
      } else {
        const msg =
          (result.body as { message?: string })?.message || "Đặt hàng thất bại";
        message.error(msg);
      }
    } catch (error) {
      console.log("error", error);
      message.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">ĐƠN HÀNG</h3>
      </div>
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center border-b border-gray-200 py-4 gap-4"
        >
          <Image
            src={item.img}
            alt={item.name}
            width={100}
            height={100}
            className="w-10 h-10 object-cover"
          />
          <div>
            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
            <p>
              {item.price.toLocaleString()}đ{" "}
              <span className="text-gray-500 font-bold"> x{item.quantity}</span>
            </p>
          </div>
        </div>
      ))}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span className="font-bold">{subtotal.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>Mã giảm giá</span>
          <DiscountInput />
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm</span>
            <span className="font-bold">
              - {discountAmount.toLocaleString()} đ
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span className="font-bold">{shippingFee.toLocaleString()} đ</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng</span>
          <span className="text-red-500">{grandTotal.toLocaleString()} đ</span>
        </div>
      </div>
      <button
        className="cursor-pointer mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={effectiveCart.length === 0}
        onClick={handlePlaceOrder}
      >
        Đặt mua
      </button>
    </div>
  );
};

export default OrderSummary;
