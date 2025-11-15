import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <Skeleton height={32} width={200} className="mb-4" />
      <div className="space-y-4">
        <Skeleton height={24} width="100%" />
        <Skeleton height={24} width="100%" />
        <Skeleton height={24} width="80%" />
      </div>
    </div>
  );
}

