// store/viewed-products-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ViewedProduct = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  discount?: number;
  isSaleProduct?: boolean;
  isNewProduct?: boolean;
  star: number;
  brand: string;
  images: string[];
  viewedAt: number; // timestamp
};

type ViewedProductsState = {
  viewedProducts: ViewedProduct[];
  addViewedProduct: (product: Omit<ViewedProduct, "viewedAt">) => void;
  removeViewedProduct: (id: string) => void;
  clearViewedProducts: () => void;
  getRecentViewed: (limit?: number) => ViewedProduct[];
};

const useViewedProductsStore = create<ViewedProductsState>()(
  persist(
    (set, get) => ({
      viewedProducts: [],
      addViewedProduct: (product) => {
        set((state) => {
          // Remove if already exists to avoid duplicates
          const filtered = state.viewedProducts.filter(
            (p) => p._id !== product._id
          );
          // Add to beginning with current timestamp
          return {
            viewedProducts: [
              { ...product, viewedAt: Date.now() },
              ...filtered,
            ].slice(0, 20), // Keep only last 20 viewed products
          };
        });
      },
      removeViewedProduct: (id) => {
        set((state) => ({
          viewedProducts: state.viewedProducts.filter((p) => p._id !== id),
        }));
      },
      clearViewedProducts: () => {
        set({ viewedProducts: [] });
      },
      getRecentViewed: (limit = 10) => {
        const products = get().viewedProducts;
        // Sort by viewedAt descending and return limited items
        return products
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, limit);
      },
    }),
    {
      name: "petcare-viewed-products",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ viewedProducts: state.viewedProducts }),
      version: 1,
    }
  )
);

export default useViewedProductsStore;

