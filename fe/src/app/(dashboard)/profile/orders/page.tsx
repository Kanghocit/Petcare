
import { getOrderByUserIdAction } from "./action";
import { getUser } from "@/actions";
import OrderTable from "@/components/tables/OrderTable";

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
