import { create } from 'zustand'

export const useProfileStore = create((set) => ({
  displayName: '',
  email: '',
  followers: 0,
  profileUrl: '',
  changeDisplayName: (displayName) => set(() => ({ displayName: displayName })),
  changeEmail: (email) => set(() => ({ email: email })),
  changeFollowers: (followers) => set(() => ({ followers: followers })),
  changeProfileUrl: (profileUrl) => set(() => ({ profileUrl: profileUrl })),
}))
