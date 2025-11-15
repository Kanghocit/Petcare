import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function CheckoutLayoutLoading() {
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Skeleton height={32} width={200} />
        <div className="flex flex-col md:flex-row gap-6 ms-4 mt-4">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton height={32} width={200} className="mb-4" />
              <div className="space-y-3">
                <Skeleton height={24} width="100%" />
                <Skeleton height={24} width="80%" />
              </div>
            </div>
          </div>
          <div className="flex-1 me-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton height={32} width={200} className="mb-4" />
              <div className="space-y-3">
                <Skeleton height={24} width="100%" />
                <Skeleton height={24} width="100%" />
                <Skeleton height={40} width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
