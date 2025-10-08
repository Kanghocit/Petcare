import UserInfo from "./UserInfo";
import MethodReceipt from "./MethodReceipt";
import PaymentMethod from "./PaymentMethod";
import { getUserAction } from "./action";

const CheckOutPage = async () => {
  const user = await getUserAction();
  console.log('user', user);
  const defaultAddress = user?.user?.address?.find((address: any) => address.isDefault);
  return (
    <div className="flex-[1]">
      <UserInfo user={user.user} />
      <MethodReceipt address={defaultAddress.name || []} />
      <PaymentMethod />
    </div>
  );
};

export default CheckOutPage;
