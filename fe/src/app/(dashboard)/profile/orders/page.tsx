import React from "react";

const OrdersPage = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Đơn hàng của bạn
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-700">Đơn hàng 1</h4>
          <p className="text-sm text-gray-700">
            <strong>Ngày đặt hàng:</strong> 12/06/2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
