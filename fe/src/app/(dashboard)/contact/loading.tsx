import { Skeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Skeleton height={32} width={200} />
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <div className="w-full md:w-1/3 space-y-4">
            <Skeleton height={40} width="100%" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border-2">
                <Skeleton height={24} width="80%" className="mb-2" />
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="90%" />
              </div>
            ))}
          </div>
          <div className="w-full md:w-2/3">
            <Skeleton height={500} rounded="xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

