// store/cartStore.ts
import { create } from 'zustand'

export type CartItem = {
  id: number
  name: string
  desc: string
  price: number
  img: string
  quantity: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (id: number, delta: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  total: () => number
}

const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (item) => {
    set((state) => {
      const exists = state.cart.find((i) => i.id === item.id)
      if (exists) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        }
      } else {
        return {
          cart: [...state.cart, { ...item, quantity: item.quantity || 1 }],
        }
      }
    })
  },
  updateQuantity: (id, delta) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      ),
    }))
  },
  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }))
  },
  clearCart: () => set({ cart: [] }),
  total: () => {
    const cart = get().cart
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))

export default useCartStore
