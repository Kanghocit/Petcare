import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string; // product id
  name: string;
  desc: string;
  price: number;
  img: string;
  quantity: number;
};

type BuyState = {
  buy: CartItem[];
  setBuy: (buy: CartItem[]) => void;
  addToBuy: (item: CartItem) => void;
  setBuyNow: (item: CartItem) => void; // For "buy now" - replaces all items
  removeFromBuy: (id: string) => void;
  clearBuy: () => void;
};

const useBuyStore = create<BuyState>()(
  persist(
    (set) => ({
      buy: [],
      setBuy: (buy) => set({ buy }),
      addToBuy: (item) => set((state) => ({ buy: [...state.buy, item] })),
      setBuyNow: (item) => set({ buy: [item] }), // Replace all items with single item
      removeFromBuy: (id) =>
        set((state) => ({ buy: state.buy.filter((item) => item.id !== id) })),
      clearBuy: () => set({ buy: [] }),
    }),
    {
      name: "petcare-buy",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ buy: state.buy }),
      version: 1,
    }
  )
);

export default useBuyStore;
