import Button from "@/components/button";
import AddressModal from "@/components/address-modal";
import React from "react";
import { addAddressAction, getUserProfileAction, setDefaultAddressAction, updateAddressAction } from "./action";
import clsx from "clsx";

const AddressesPage = async () => {
  const profile = await getUserProfileAction();
  const addresses = profile?.user?.address ?? profile?.user?.addresses ?? [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Địa chỉ của bạn</h3>
          <p className="text-sm text-gray-500">Quản lý các địa chỉ giao hàng đã lưu</p>
        </div>
        <AddressModal onSubmit={addAddressAction}>
          <Button className="w-fit">Thêm địa chỉ</Button>
        </AddressModal>
      </div>

      <div className="flex flex-col gap-3">
        {addresses.length === 0 && (
          <div className={clsx("flex items-center justify-between rounded-xl shadow-sm shadow-gray-100 p-6 bg-gray-50 text-gray-600")}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white shadow-inner flex items-center justify-center text-gray-400">📍</div>
              <div>
                <p className="text-sm">Chưa có địa chỉ nào</p>
                <p className="text-xs text-gray-500">Thêm địa chỉ để đặt hàng nhanh hơn</p>
              </div>
            </div>
            <AddressModal onSubmit={addAddressAction}>
              <Button className="w-fit">Thêm địa chỉ</Button>
            </AddressModal>
          </div>
        )}

        {addresses.map((addr: { _id: string; name: string; isDefault?: boolean }) => (
          <div
            key={addr._id}
            className="group flex items-center justify-between rounded-xl shadow-sm shadow-gray-100  p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">🏠</div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{addr.name}</h4>
                {addr.isDefault && (
                  <span className="inline-flex mt-1 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/15">
                    Mặc định
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AddressModal
                onSubmit={updateAddressAction as any}
                initialAddress={addr}
                modalTitle="Cập nhật địa chỉ"
                okText="Lưu"
              >
                <button type="button" className="text-xs font-medium text-gray-600 hover:text-gray-800 hover:underline cursor-pointer">Sửa</button>
              </AddressModal>
              {!addr.isDefault && (
                <form action={async () => { "use server"; await setDefaultAddressAction(addr._id); }}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Đặt mặc định
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesPage;
