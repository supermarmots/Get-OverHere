import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthReady: false,
  setAuthUser: (user) => set({ user, isAuthReady: true }),
  clearAuthUser: () => set({ user: null, isAuthReady: true }),
}))
