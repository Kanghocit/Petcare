import UserInfo from "./UserInfo";
import MethodReceipt from "./MethodReceipt";
import PaymentMethod from "./PaymentMethod";
import { getUserAction } from "./action";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// No revalidate for checkout (dynamic, user-specific)
export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Thanh toán",
  description: "Hoàn tất đơn hàng của bạn",
  robots: {
    index: false,
    follow: false,
  },
});

const CheckOutPage = async () => {
  const user = await getUserAction();

  const defaultAddress = user?.user?.address?.find(
    (address: any) => address.isDefault
  );
  return (
    <div className=" flex-1">
      <UserInfo user={user.user} />
      <MethodReceipt address={defaultAddress.name || []} />
      <PaymentMethod />
    </div>
  );
};

export default CheckOutPage;
