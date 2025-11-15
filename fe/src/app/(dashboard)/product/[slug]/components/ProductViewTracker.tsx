"use client";

import { useEffect } from "react";
import useViewedProductsStore from "@/store/viewed-products-store";
import { Product } from "@/interface/product";

type ProductViewTrackerProps = {
  product: Product;
};

const ProductViewTracker = ({ product }: ProductViewTrackerProps) => {
  const addViewedProduct = useViewedProductsStore(
    (state) => state.addViewedProduct
  );

  useEffect(() => {
    // Add product to viewed products when component mounts
    if (product && product._id) {
      addViewedProduct({
        _id: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        discount: product.discount,
        isSaleProduct: product.isSaleProduct,
        isNewProduct: product.isNewProduct,
        star: product.star || 5,
        brand: product.brand || "",
        images: product.images || [],
      });
    }
  }, [product, addViewedProduct]);

  return null; // This component doesn't render anything
};

export default ProductViewTracker;

