"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "antd";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/interface/user";

interface ProfileLayoutWrapperProps {
  children: React.ReactNode;
  user: User;
}

export default function ProfileLayoutWrapper({
  children,
  user,
}: ProfileLayoutWrapperProps) {
  const pathname = usePathname();

  console.log('user', user);

  // Nếu là order detail page thì chỉ render children
  if (
    pathname?.includes("/profile/orders/") &&
    pathname !== "/profile/orders"
  ) {
    return (
      <div className="container mx-auto ">
        <div className="mx-12 py-8">{children}</div>
      </div>
    );
  }

  // Layout bình thường với profile sidebar
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="grid grid-cols-4 gap-6 mt-6 mx-4">
          {/* Cột trái (3 cột) */}
          <div className="col-span-3 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-4">
                <Image
                  src="/images/checklist.png"
                  alt="history"
                  width={80}
                  height={80}
                  className="w-8 h-8 "
                />
                <Link href="/profile/orders">
                  <p className="font-semibold hover:text-[#FF8661] cursor-pointer">
                    Lịch sử đơn hàng
                  </p>
                </Link>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-4">
                <Image
                  src="/images/account.webp"
                  alt="user"
                  width={100}
                  height={100}
                  className="w-8 h-8 rounded-full"
                />
                <Link href="/profile">
                  <p className="font-semibold hover:text-[#FF8661] cursor-pointer">
                    Xin chào,{" "}
                    <span className="font-semibold">
                      {user?.name}!
                    </span>
                  </p>
                </Link>
              </div>
            </div>
            {children}
          </div>

          {/* Cột phải (1 cột) */}
          <div className="col-span-1 bg-white rounded-xl p-6 shadow-lg h-fit">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Thông tin cá nhân
            </h3>
            <div className="text-sm  flex flex-col gap-4">
              <Link
                href="/profile/addresses"
                className="border-b border-gray-200 pb-4 cursor-pointer hover:!text-[#FF8661] !text-gray-800"
              >
                📍 Địa chỉ đã lưu ({user?.address?.length || 0})
              </Link>
              <Link
                href="/profile/change-password"
                className="border-b border-gray-200 pb-4 cursor-pointer hover:!text-[#FF8661] !text-gray-800"
              >
                🔁 Đổi mật khẩu
              </Link>
              <div className="cursor-pointer hover:!text-[#FF8661] !text-gray-800">
                🚪 Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
