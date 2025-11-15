import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <>
      <Skeleton height={32} width={200} />
      <div className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <Skeleton height={32} width={200} className="mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Skeleton width={70} height={70} rounded="xl" />
                    <div className="flex-1">
                      <Skeleton height={20} width="80%" className="mb-2" />
                      <Skeleton height={16} width="60%" />
                    </div>
                    <Skeleton height={24} width={100} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-2xl p-6 w-full max-w-md shadow-xl">
                <Skeleton height={32} width={150} className="mb-6" />
                <div className="space-y-3">
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={32} width="100%" />
                </div>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-xl">
                <Skeleton height={32} width={180} className="mb-4" />
                <div className="space-y-3">
                  <Skeleton height={20} width="100%" />
                  <Skeleton height={20} width="100%" />
                  <Skeleton height={20} width="80%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

