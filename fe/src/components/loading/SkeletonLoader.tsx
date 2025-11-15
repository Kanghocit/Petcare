import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full" | "xl";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
}) => {
  const roundedClass = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded || "md"];

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${roundedClass} ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <Skeleton height={200} rounded="none" />
    <div className="p-4 space-y-2">
      <Skeleton height={20} width="80%" />
      <Skeleton height={16} width="60%" />
      <div className="flex gap-2 mt-3">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={80} />
      </div>
    </div>
  </div>
);

export const ProductListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} height={40} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <Skeleton height={200} rounded="none" />
    <div className="p-4 space-y-2">
      <Skeleton height={24} width="90%" />
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="60%" />
    </div>
  </div>
);

export const BrandCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex flex-col items-center gap-3">
      <Skeleton width={120} height={80} rounded="md" />
      <Skeleton height={16} width="80%" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="container mx-auto px-4 py-8 space-y-6">
    <Skeleton height={40} width="200px" />
    <Skeleton height={300} rounded="lg" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton height={200} rounded="lg" />
      <Skeleton height={200} rounded="lg" />
    </div>
  </div>
);

export default Skeleton;

