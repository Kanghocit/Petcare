import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManageOrderTable from "@/components/tables/ManageOrderTable";
import { getOrdersAction } from "./action";
import { Metadata } from "next";
import SelectAction from "./components/SelectAction";
import SearchOrders from "./components/SearchOrders";

export const metadata: Metadata = {
  title: "Kangdy Admin ",
  description: "Kangdy",
  // other metadata
};

const ManageOrderTablePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    search?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    status?: string;
  }>;
}) => {
  const {
    page = 1,
    search,
    paymentMethod,
    paymentStatus,
    fulfillmentStatus,
    status,
  } = await searchParams;
  const data = await getOrdersAction(page, {
    search,
    paymentMethod: paymentMethod as "cod" | "ck" | "momo" | undefined,
    paymentStatus: paymentStatus as
      | "unpaid"
      | "authorized"
      | "paid"
      | "partially_refunded"
      | "refunded"
      | "failed"
      | "voided"
      | "chargeback"
      | undefined,
    fulfillmentStatus: fulfillmentStatus as
      | "unfulfilled"
      | "processing"
      | "shipping"
      | "shipped"
      | "delivered"
      | "returned"
      | "cancelled"
      | undefined,
    status: status as "open" | "completed" | "cancelled" | "closed" | undefined,
  });

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách đơn hàng" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lí đơn hàng"
          subHeader={
            <div className="flex items-center justify-between gap-2">
              <SearchOrders />
            </div>
          }
          underTitle={<SelectAction />}
        >
          <ManageOrderTable
            orders={{ orders: data?.orders || [], total: data?.total || 0 }}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default ManageOrderTablePage;
