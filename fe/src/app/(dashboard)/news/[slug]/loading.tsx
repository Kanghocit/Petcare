import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Skeleton height={32} width={200} />
        <div className="flex flex-col gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <Skeleton height={400} rounded="lg" />
          <div className="space-y-4">
            <Skeleton height={40} width="80%" />
            <Skeleton height={24} width="60%" />
            <div className="space-y-2">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="95%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="90%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

