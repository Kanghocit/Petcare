import { ProductListSkeleton } from "@/components/loading/SkeletonLoader";

export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md" />
      <div className="flex gap-4 mx-4">
        <div className="w-1/4">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        </div>
        <div className="w-3/4">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md mb-4" />
          <ProductListSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
