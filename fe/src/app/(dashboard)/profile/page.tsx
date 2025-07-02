import Breadcrumb from "@/components/breadCrumb";
import { getUser } from "@/action";
import React from "react";
import Image from "next/image";

const ProfilePage = async () => {
  const userData = await getUser();
  console.log("userData", userData);

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
                <p className="font-semibold hover:text-[#FF8661] cursor-pointer">
                  Lịch sử đơn hàng
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-4">
                <Image
                  src="/images/account.webp"
                  alt="user"
                  width={100}
                  height={100}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-semibold hover:text-[#FF8661] cursor-pointer">
                  Xin chào,{" "}
                  <span className="text-blue-700 font-semibold">
                    {userData?.user?.name}!
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Thông tin tài khoản
              </h3>
              <p>
                <strong>Họ tên:</strong> {userData?.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {userData?.user?.email}
              </p>
            </div>
          </div>

          {/* Cột phải (1 cột) */}
          <div className="col-span-1 bg-white rounded-xl p-6 shadow-lg h-fit">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Thông tin cá nhân
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>📍 Địa chỉ đã lưu (0)</li>
              <li>🔁 Đổi mật khẩu</li>
              <li>🚪 Đăng xuất</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
