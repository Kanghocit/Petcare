import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="flex-1 space-y-6">
      {/* User Info Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton height={32} width={200} className="mb-4" />
        <div className="space-y-3">
          <Skeleton height={24} width="100%" />
          <Skeleton height={24} width="80%" />
          <Skeleton height={24} width="90%" />
        </div>
      </div>
      {/* Method Receipt Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton height={32} width={200} className="mb-4" />
        <Skeleton height={100} width="100%" rounded="lg" />
      </div>
      {/* Payment Method Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton height={32} width={200} className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={60} width="100%" rounded="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
