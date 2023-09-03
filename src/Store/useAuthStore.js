import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create(
  persist(
    (set) => ({
      userId: '',
      isLoggedIn: false,
      changeUserId: (id) => set({ userId: id }),
      changeIsLoggedIn: (value) => set({ isLoggedIn: value }),
      signOut: () => set({ userId: '', isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
