import { Skeleton, TableSkeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <Skeleton height={32} width={250} className="mb-4" />
      <TableSkeleton rows={5} cols={6} />
    </div>
  );
}
