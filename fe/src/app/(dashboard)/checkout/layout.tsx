import Breadcrumb from "@/components/breadCrumb";
import OrderSummary from "./OrderSummary";

const CheckOutPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row gap-6 ms-4 mt-4">
          {/* Left column */}
          <div className="flex-[1]">{children}</div>
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
