import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
    id: string,
    name: string,
    email: string,
    role: "admin" | 'staff' | 'user'
}

type UserState = {
    user: User | null,
    setUser: (user: User | null) => void
    clearUser: () => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null, isLoading: false }),

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'admin-user-storage', // unique name
      partialize: (state) => ({ user: state.user }), // only persist user, not loading
    }
  )
)