"use client";

import type { User } from "@/interface/user";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useCheckoutStore from "@/store/checkout-store";

type UserInfoProps = { user: User };
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const setUserInfo = useCheckoutStore((s) => s.setUserInfo);

  useEffect(() => {
    setUserInfo({ fullName: name, email, phone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">ĐẶT HÀNG</h2>
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsEditing((v) => !v)}
        >
          {isEditing ? "Lưu" : "Thay đổi"}
        </button>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Tên khách hàng</div>
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setUserInfo({ fullName: e.target.value });
              }}
              className="w-full border rounded-lg px-3 py-2"
            />
          ) : (
            <div className="font-medium">{name}</div>
          )}
        </div>
        <div>
          <div className="text-gray-500 mb-1">Email</div>
          {isEditing ? (
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setUserInfo({ email: e.target.value });
              }}
              className="w-full border rounded-lg px-3 py-2"
            />
          ) : (
            <div className="font-medium">{email}</div>
          )}
        </div>
        <div>
          <div className="text-gray-500 mb-1">Điện thoại</div>
          {isEditing ? (
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setUserInfo({ phone: e.target.value });
              }}
              className="w-full border rounded-lg px-3 py-2"
            />
          ) : (
            <div className="font-medium">{phone}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
