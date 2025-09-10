"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ReceiptMethod = "home" | "store";
export type PaymentMethod = "cod" | "momo" | "ck";

type CheckoutState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  receiptMethod: ReceiptMethod;
  paymentMethod: PaymentMethod;
  note: string;
  invoice: boolean;
  discountCode?: string;
  discountAmount?: number;
  setUserInfo: (
    payload: Partial<Pick<CheckoutState, "fullName" | "email" | "phone">>
  ) => void;
  setAddress: (address: string) => void;
  setReceiptMethod: (method: ReceiptMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNote: (note: string) => void;
  setInvoice: (invoice: boolean) => void;
  setDiscount: (code: string | undefined, amount: number | undefined) => void;
  reset: () => void;
};

const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      receiptMethod: "home",
      paymentMethod: "cod",
      note: "",
      invoice: false,
      discountCode: undefined,
      discountAmount: undefined,
      setUserInfo: (payload) => set((state) => ({ ...state, ...payload })),
      setAddress: (address) => set({ address }),
      setReceiptMethod: (method) => set({ receiptMethod: method }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setNote: (note) => set({ note }),
      setInvoice: (invoice) => set({ invoice }),
      setDiscount: (code, amount) =>
        set({ discountCode: code, discountAmount: amount }),
      reset: () =>
        set({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          receiptMethod: "home",
          paymentMethod: "cod",
          note: "",
          invoice: false,
          discountCode: undefined,
          discountAmount: undefined,
        }),
    }),
    {
      name: "petcare-checkout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        address: state.address,
        receiptMethod: state.receiptMethod,
        paymentMethod: state.paymentMethod,
        note: state.note,
        invoice: state.invoice,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
      version: 1,
    }
  )
);

export default useCheckoutStore;
