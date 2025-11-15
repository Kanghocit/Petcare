
import { getOrderByUserIdAction } from "./action";
import { getUser } from "@/actions";
import OrderTable from "@/components/tables/OrderTable";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// No revalidate for user-specific pages (dynamic)
export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Đơn hàng",
  description: "Xem lịch sử đơn hàng của bạn",
  robots: {
    index: false,
    follow: false,
  },
});

const OrdersPage = async () => {
  const data = await getUser();
  const userData = data.user;
  const userId = userData._id;

  const ordersData = await getOrderByUserIdAction(userId);
  const orders = ordersData.ok ? ordersData.orders : [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">
        Đơn hàng của bạn ({orders.length})
      </h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
};

export default OrdersPage;
