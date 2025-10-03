"use client";

import React, { useEffect, useMemo, useState } from "react";
import useCartStore from "@/store/cart-store";
import useCheckoutStore from "@/store/checkout-store";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import {
  createOrderAction,
  createPaymentAction,
  getUserAction,
  postValidateVoicherAction,
  postUseVoicherAction,
} from "./action";
import { CreateOrderPayload } from "@/libs/order";
import { App, Button, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import useBuyStore from "@/store/buy-store";

const DiscountInput: React.FC<{ subtotal: number }> = ({ subtotal }) => {
  const [code, setCode] = useState("");
  const setDiscount = useCheckoutStore((s) => s.setDiscount);
  const appliedAmount = useCheckoutStore((s) => s.discountAmount) || 0;
  const { message } = App.useApp();

  // useEffect(() => {
  //   if (appliedCode) setCode(appliedCode);
  // }, [appliedCode]);

  const apply = async () => {
    if (!code.trim()) {
      message.error("Vui lòng nhập mã voicher");
      return;
    }

    try {
      const user = await getUserAction();
      const userId = user.user._id;
      const res = await postValidateVoicherAction(
        code.trim(),
        userId,
        subtotal
      );

      if (res.ok) {
        const discountValueStr = res.voicher.discountValue;
        let discountAmount = 0;

        // Kiểm tra nếu là phần trăm (có ký tự %)
        if (discountValueStr.includes("%")) {
          const percentage = parseFloat(discountValueStr.replace("%", ""));
          // Tính phần trăm của subtotal
          discountAmount = Math.round((subtotal * percentage) / 100);
        } else {
          // Nếu là số tiền cố định
          discountAmount = parseInt(discountValueStr);
        }

        setDiscount(code.trim(), discountAmount);
        message.success(
          `Áp dụng voicher thành công! Giảm ${discountAmount.toLocaleString()}đ`
        );
      } else {
        message.error(res.message || "Voicher không hợp lệ");
      }
    } catch (error) {
      console.error("Voicher error:", error);
      message.error(`Lỗi khi sử dụng voicher ${error}`);
    }
  };

  const clear = () => setDiscount(undefined, undefined);

  return (
    <div className="flex flex-col justify-between gap-2 my-2">
      <span>Mã giảm giá</span>
      <div className="flex items-center gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã"
          className="border rounded px-2 py-1 text-sm w-28 "
        />
        {appliedAmount > 0 ? (
          <Button onClick={clear} danger>
            Hủy
          </Button>
        ) : (
          <Button onClick={apply} type="primary">
            Áp dụng
          </Button>
        )}
      </div>
    </div>
  );
};

const OrderSummary: React.FC = () => {
  const search = useSearchParams();
  const { message } = App.useApp();
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearBuy = useBuyStore((state) => state.clearBuy);

  const [cartFromStorage, setCartFromStorage] = useState<typeof cart>([]);
  const buy = useBuyStore((state) => state.buy);
  const setBuy = useBuyStore((state) => state.setBuy);

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

  // Determine which data to display based on checkout source
  const urlParams = new URLSearchParams(window.location.search);
  const fromBuyNow = urlParams.get("from") === "buy-now";
  const fromCart = urlParams.get("from") === "cart";

  const effectiveCart = fromBuyNow
    ? buy // For buy-now, always use buy store
    : fromCart
    ? buy.length > 0
      ? buy
      : cart // For cart, prefer synced buy store, fallback to cart
    : buy.length > 0
    ? buy
    : cart.length > 0
    ? cart
    : cartFromStorage; // Default fallback logic
  const subtotal = useMemo(() => {
    // Calculate subtotal based on effectiveCart (what's actually displayed)
    return effectiveCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [effectiveCart]);

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

  // Sync data based on checkout source and clear discount for new orders
  useEffect(() => {
    const setDiscount = useCheckoutStore.getState().setDiscount;

    if (fromBuyNow) {
      // If from buy-now, buy store already has the single item we want to purchase
      // Clear discount since this is a new "buy now" order
      setDiscount(undefined, undefined);
    } else if (fromCart) {
      // If from cart drawer, cart should already be synced to buy store
      // But double-check in case of timing issues
      if (buy.length === 0 && cart.length > 0) {
        setBuy(cart);
      }
      // Clear discount since we're coming from cart (new checkout session)
      setDiscount(undefined, undefined);
    } else {
      // Direct access to checkout page, try to sync from available data
      if (buy.length === 0 && cart.length > 0) {
        setBuy(cart);
      } else if (buy.length === 0 && cartFromStorage.length > 0) {
        setBuy(cartFromStorage);
      }
      // Don't clear discount for direct access (user might be refreshing)
    }
  }, [fromBuyNow, fromCart, buy.length, cart, cartFromStorage, setBuy]);

  const handlePlaceOrder = async () => {
    // Use effectiveCart for order creation (what user sees is what they get)
    const itemsToOrder = effectiveCart;

    if (itemsToOrder.length === 0) {
      message.error("Giỏ hàng trống!");
      return;
    }

    const items = itemsToOrder.map((i) => ({
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
    let orderCode = "";

    try {
      const result = await createOrderAction(payload);
      orderCode =
        (result.body as { order?: { orderCode?: string } })?.order?.orderCode ||
        "";
      if (result.ok) {
        // Nếu có voicher được áp dụng, thực sự sử dụng voicher
        if (discountCode) {
          try {
            const user = await getUserAction();
            const userId = user.user._id;
            await postUseVoicherAction(discountCode, userId, subtotal);
          } catch (voicherError) {
            console.error("Voicher usage error:", voicherError);
            // Không cần hiển thị lỗi cho user vì đơn hàng đã được tạo thành công
          }
        }

        const msg =
          (result.body as { message?: string })?.message ||
          "Đặt hàng thành công";
        message.success(msg);
        if (paymentMethod === "momo") {
          const result = await createPaymentAction(orderCode, grandTotal);
          console.log("result", result);
          if (result.ok && result.data) {
            // MoMo API trả về payUrl trực tiếp trong data
            const payUrl = result.data.payUrl || result.data;
            if (payUrl) {
              window.location.href = payUrl;
              clearCart();
              clearBuy();
            } else {
              message.error("Không thể tạo link thanh toán");
            }
          } else {
            message.error("Không thể tạo link thanh toán");
          }
          return;
        }
        clearCart();
        clearBuy();
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
      {effectiveCart.map((item) => (
        <div
          key={item.id}
          className="flex flex-col  border-b border-gray-200 py-4 gap-4"
        >
          <div className="flex gap-2">
            <Image
              src={item.img}
              alt={item.name}
              width={100}
              height={100}
              className="w-10 h-10 object-cover"
            />
            <div>
              <h4 className="font-semibold text-sm line-clamp-1">
                {item.name}
              </h4>
              <p>
                {item.price.toLocaleString()}đ{" "}
                <span className="text-gray-500 font-bold">
                  {" "}
                  x{item.quantity}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
      <DiscountInput subtotal={subtotal} />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span className="font-bold">{subtotal.toLocaleString()} đ</span>
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
        {search.size !== 0 ? "Thanh toán" : "Đặt mua"}
      </button>
    </div>
  );
};

export default OrderSummary;
