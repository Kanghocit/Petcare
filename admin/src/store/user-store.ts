import { create } from 'zustand'

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
}

export const useUserStore = create<UserState>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    clearUser: () => set({ user: null }),
}))