import { create } from 'zustand'

export const useQueueStore = create((set) => ({
    queue: [],
    role: 'personal',
    isShuffle: false,
    changeQueue: (currQueue) => set(() => ({ queue: currQueue })),
    changeIsShuffle: (value) => set(() => ({ isShuffle: value })),
    delStoreQueue: () => set(() => ({ queue: [] })),
    changeRole: (role) => {
        set(() => ({ role: role }))
        console.log('change role', role)
    },
}))
