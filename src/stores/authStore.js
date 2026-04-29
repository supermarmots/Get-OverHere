import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  error: '',
  isAuthReady: false,
  user: null,
  setAuthError: (error) => set({ error, isAuthReady: true, user: null }),
  setAuthUser: (user) => set({ error: '', user, isAuthReady: true }),
  clearAuthUser: () => set({ error: '', user: null, isAuthReady: true }),
}))
