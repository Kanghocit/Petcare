import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4 container mx-auto">
      <Skeleton height={32} width={200} />
      <div className="grid grid-cols-2 bg-[#f4f4f4] p-4 rounded-md mx-4 shadow-sm gap-6">
        {/* Product Image Skeleton */}
        <div className="space-y-4">
          <Skeleton height={400} rounded="lg" />
          <div className="flex gap-4 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width={130} height={130} rounded="md" />
            ))}
          </div>
        </div>
        {/* Product Info Skeleton */}
        <div className="space-y-4">
          <Skeleton height={32} width="80%" />
          <Skeleton height={24} width="60%" />
          <Skeleton height={40} width="40%" />
          <div className="space-y-2">
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="95%" />
          </div>
          <Skeleton height={50} width="100%" rounded="lg" />
        </div>
      </div>
      {/* Description Skeleton */}
      <div className="mx-4 space-y-4">
        <Skeleton height={32} width={200} />
        <Skeleton height={200} rounded="lg" />
      </div>
    </div>
  );
}

