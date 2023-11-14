import { create } from 'zustand'

export const useQueueStore = create((set) => ({
  queue: [],
  changeQueue: (currQueue) => set(() => ({ queue: currQueue })),
  delStoreQueue: () =>
    set(() => ({ queue: []})),
}))
