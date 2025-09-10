import UserInfo from "./UserInfo";
import MethodReceipt from "./MethodReceipt";
import PaymentMethod from "./PaymentMethod";
import { getUserAction } from "./action";

const CheckOutPage = async () => {
  const user = await getUserAction();
  return (
    <div className="flex-[1]">
      <UserInfo user={user.user} />
      <MethodReceipt address={user?.user?.address} />
      <PaymentMethod />
    </div>
  );
};

export default CheckOutPage;
