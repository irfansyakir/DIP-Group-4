import { create } from 'zustand'

export const useQueueStore = create((set) => ({
    queue: [],
    isInsideRoom: false,
    changeQueue: (currQueue) => set(() => ({ queue: currQueue })),
    delStoreQueue: () => set(() => ({ queue: [] })),
    changeIsInsideRoom: (bool) => set(() => ({ isInsideRoom: bool })),
}))
