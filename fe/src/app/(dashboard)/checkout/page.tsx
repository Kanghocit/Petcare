import Breadcrumb from "@/components/breadCrumb";
import UserInfo from "./UserInfo";
import MethodReceipt from "./MethodReceipt";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import { getUserAction } from "./action";

const CheckOutPage = async () => {
  const user = await getUserAction();
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row gap-6 ms-4 mt-4">
          {/* Left column */}
          <div className="flex-[3]">
            <UserInfo user={user.user} />
            <MethodReceipt address={user?.user?.address} />
            <PaymentMethod />
          </div>
          {/* Right column */}
          <div className="flex-[1] me-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
