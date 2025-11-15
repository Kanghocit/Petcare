import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton height={28} width={200} className="mb-2" />
          <Skeleton height={16} width={300} />
        </div>
        <Skeleton height={40} width={120} rounded="lg" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <Skeleton width={36} height={36} rounded="lg" />
              <div>
                <Skeleton height={20} width={200} className="mb-2" />
                <Skeleton height={16} width={150} />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton height={20} width={40} />
              <Skeleton height={20} width={80} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

