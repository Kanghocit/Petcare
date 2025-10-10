"use client";

import { Staff } from '@/interface/Customer'
import { Image } from "antd";

export default function StaffInfoCard({ user }: { user: Staff }) {

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Thông tin nhân viên
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
                                    Trạng thái tài khoản
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {user?.status || "--"}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
