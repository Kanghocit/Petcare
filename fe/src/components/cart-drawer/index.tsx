"use client";

// components/CartDrawer.tsx
import React, { useState } from "react";
import { Drawer, Button, Progress, message } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import useCartStore from "@/store/cart-store";
import { useRouter } from "next/navigation";

const PROMO_MILESTONES = [
  { amount: 500000, discount: 50000, code: "50K" },
  { amount: 1000000, discount: 100000, code: "100K" },
];

const CartDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  console.log("cart", cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const total = useCartStore((state) => state.total)();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const reachedMilestones = PROMO_MILESTONES.filter((m) => total >= m.amount);
  const nextMilestone = PROMO_MILESTONES.find((m) => total < m.amount);
  const progress = nextMilestone ? (total / nextMilestone.amount) * 100 : 100;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã copy mã: ${code}`);
  };

  const handleQty = (id: string, delta: number) => updateQuantity(id, delta);
  const handleRemove = (id: string) => removeFromCart(id);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <>
      <div className="cursor-pointer" onClick={showDrawer}>
        {children}
      </div>
      <Drawer
        title={<span className="font-bold text-2xl">Giỏ hàng</span>}
        closable={false}
        onClose={onClose}
        open={open}
        placement="right"
        width={420}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 20 }} />}
            onClick={onClose}
          />
        }
        className="!h-screen !overflow-hidden !w-full "
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="flex flex-col h-full gap-4 w-full ">
          <div className="flex-grow">
            <div className="bg-orange-50 border border-orange-300 rounded-md px-4 py-3 m-4">
              <div className="text-orange-500 font-semibold text-center mb-2">
                {nextMilestone
                  ? `Bạn cần mua thêm ${(
                      nextMilestone.amount - total
                    ).toLocaleString()}đ để được giảm ${
                      nextMilestone.discount / 1000
                    }k`
                  : `Bạn đã đủ điều kiện giảm ${
                      PROMO_MILESTONES[1].discount / 1000
                    }k!`}
              </div>
              <div className="relative flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor="#ff8662"
                    trailColor="#ffe5d6"
                    strokeWidth={6}
                  />
                </div>
              </div>
              {reachedMilestones.length > 0 && (
                <div className="text-center text-orange-600 font-semibold mt-2 flex items-center justify-center gap-2">
                  Đã nhận :
                  {reachedMilestones.map((m) => (
                    <span
                      key={m.code}
                      className="bg-orange-100 border border-orange-300 rounded px-2 py-1 mx-1 text-orange-700"
                    >
                      Mã giảm giá {m.code}
                      <Button
                        size="small"
                        className="ml-2"
                        onClick={() => handleCopy(m.code)}
                      >
                        copy
                      </Button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 flex-1 overflow-y-auto flex-grow">
              {cart.length < 1 ? (
                <div className="text-center text-gray-400 py-10">
                  Giỏ hàng trống
                </div>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-4 border-b last:border-b-0"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-base leading-tight">
                        {item.name}
                      </div>
                      <div className="text-gray-400 text-sm mb-1">
                        {item.desc}
                      </div>
                      <div className="text-[#ff8662] font-bold text-lg">
                        {item.price.toLocaleString()}đ
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleQty(item.id, -1)}
                        style={{ border: "1px solid #eee" }}
                      />
                      <span className="px-2 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleQty(item.id, 1)}
                        style={{ border: "1px solid #eee" }}
                      />
                    </div>
                    <Button
                      type="text"
                      icon={<DeleteOutlined style={{ color: "#bbb" }} />}
                      onClick={() => handleRemove(item.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t px-4 pt-3 pb-2 bg-white">
            <div className="flex justify-between gap-2 text-gray-500 text-sm mb-2">
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg">🛒</span>
                <span>Xuất hóa đơn</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg">🕒</span>
                <span>Hẹn giờ nhận</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg">📝</span>
                <span>Ghi chú đơn</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg">🎉</span>
                <span>Mã giảm giá</span>
              </div>
            </div>
            <div className="flex justify-between items-center font-bold text-base mt-2">
              <span>TỔNG CỘNG</span>
              <span className="text-[#ff8662] text-lg">
                {total.toLocaleString()}đ
              </span>
            </div>
            <div className="text-gray-400 text-xs mb-2 text-end">
              Nhập mã giảm giá ở trang thanh toán
            </div>
            <Button
              type="primary"
              block
              size="large"
              style={{
                background: "#ff8662",
                border: "none",
                fontWeight: 600,
                fontSize: 18,
                borderRadius: 999,
              }}
              onClick={() => {
                router.push("/checkout");
                setOpen(false);
                clearCart();
              }}
            >
              ĐẶT HÀNG →
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CartDrawer;
