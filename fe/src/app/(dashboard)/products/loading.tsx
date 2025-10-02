"use client";

import { Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-2xl mx-auto">
      {/* Breadcrumb skeleton */}
      <Skeleton.Input active className="w-full! mx-2 h-10!" />

      <div className="flex gap-4 mx-4">
        {/* Sidebar filter skeleton */}
        <div className="w-1/4 rounded-lg p-4 bg-white">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>

        {/* Product list skeleton */}
        <div className="w-3/4">
          {/* Title skeleton */}
          <Skeleton.Input active className="w-50!" />

          <div className="flex flex-wrap gap-4 mt-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-64 !rounded-2xl p-3 shadow-sm bg-white">
                {/* Image skeleton */}
                <div className="relative w-full h-[180px] overflow-hidden rounded-md mb-3">
                  <Skeleton.Image
                    active
                    className="!rounded-md w-full! min-h-[180px]"
                  />
                </div>

                {/* Title skeleton */}
                <div className="mb-2">
                  <Skeleton.Input active className="w-full! h-5!" />
                </div>

                {/* Price + cart button skeleton */}
                <div className="flex items-center justify-between min-h-[45px] mb-2">
                  <div className="flex flex-col gap-2">
                    <Skeleton.Input active className="w-full! h-5!" />
                    <Skeleton.Input active className="w-full! h-5!" />
                  </div>
                </div>

                {/* "Vừa mở bán" skeleton */}
                <div className="flex items-center  justify-between gap-2">
                  <Skeleton.Input active style={{ width: 100, height: 16 }} />
                  <Skeleton.Button active shape="circle" size="large" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
