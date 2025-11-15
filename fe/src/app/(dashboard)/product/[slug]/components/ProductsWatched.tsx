"use client";

import ProductCard from "@/components/product-card";
import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import useViewedProductsStore from "@/store/viewed-products-store";
import { useParams } from "next/navigation";

const ProductsWatched = () => {
  const params = useParams();
  const currentSlug = params?.slug as string;

  const [emblaRef] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const getRecentViewed = useViewedProductsStore(
    (state) => state.getRecentViewed
  );
  const allRecentViewed = getRecentViewed(20); // Get last 20 viewed products

  // Filter out current product from viewed products
  const recentViewed = useMemo(() => {
    return allRecentViewed.filter((product) => product.slug !== currentSlug);
  }, [allRecentViewed, currentSlug]);

  // Don't show if no viewed products (excluding current product)
  if (recentViewed.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-bold mb-4">Sản phẩm bạn đã xem</h2>

      {/* Đây là viewport, cần gán ref ở đây */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Đây là track, chứa các slide */}
        <div className="flex gap-4">
          {recentViewed.map((product) => (
            <div className="flex-shrink-0" key={product._id} style={{ minWidth: '256px' }}>
              <ProductCard
                id={product._id}
                slug={product.slug}
                title={product.title}
                star={product.star}
                price={product.price}
                isSale={product.isSaleProduct}
                discount={product.discount}
                isNew={product.isNewProduct}
                img={
                  product.images && product.images.length > 0
                    ? [product.images[0], product.images[1] || product.images[0]]
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsWatched;
