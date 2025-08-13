"use client";

import {Customer} from '@/interface/Customer'
import { Image } from "antd";
import Orders from '../ecommerce/Orders';

export default function UserInfoCard({user} : {user: Customer}) {
  
  return (
    <>
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Thông tin khách hàng
          </h4>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-64">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              width={80}
              height={80}
              src={user?.avatar || "/avatar-fallback.png"}
              alt={user?.name || "avatar"}
              fallback="/avatar-fallback.png"
            />
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Họ và tên
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tài khoản
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.username || "--"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.phone || "--"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Đã xác minh
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.isVerified ? "Đã xác minh": "Chưa xác minh"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Rank
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.rank || "--"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Trạng thái tài khoản
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.status || "--"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tổng mức chi tiêu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.total_spend ?? "--"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ghi chú về khách
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.note || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Orders/>  
  </>
  );
}
