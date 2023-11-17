import { create } from 'zustand'

export const useQueueStore = create((set) => ({
  queue: [],
  isShuffle: false,
  changeQueue: (currQueue) => set(() => ({ queue: currQueue })),
  changeIsShuffle: (value) => set(() => ({ isShuffle: value })),
  delStoreQueue: () =>
    set(() => ({ queue: []})),
}))
