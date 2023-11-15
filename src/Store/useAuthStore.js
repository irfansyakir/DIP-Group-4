import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: '',
      code: '',
      codeVerifier: '',
      accessToken: '',
      refreshToken: '',
      changeUserId: (id) => set(() => ({ userId: id })),
      changeIsLoggedIn: (value) => set(() => ({ isLoggedIn: value })),
      changeCode: (value) => set(() => ({ code: value })),
      changeCodeVerifier: (value) => set(() => ({ codeVerifier: value })),
      changeAccessToken: (value) => set(() => ({ accessToken: value })),
      changeRefreshToken: (value) => set(() => ({ refreshToken: value })),
      signOut: () =>
        set(() => ({
          isLoggedIn: false,
          code: '',
          userId: '',
          codeVerifier: '',
          accessToken: '',
          refreshToken: '',
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
