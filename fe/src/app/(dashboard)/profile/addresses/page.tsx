import Button from "@/components/button";
import AddressModal from "@/components/address-modal";
import React from "react";

const AddressesPage = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Địa chỉ đã lưu
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-700">Địa chỉ 1</h4>
          <p className="text-sm text-gray-700">
            <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. HCM
          </p>
        </div>
        <AddressModal>
          <Button className="w-fit">Thêm địa chỉ</Button>
        </AddressModal>
      </div>
    </div>
  );
};

export default AddressesPage;
