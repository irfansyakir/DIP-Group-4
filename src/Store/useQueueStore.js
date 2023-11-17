import { create } from 'zustand'

export const useQueueStore = create((set) => ({
    queue: [],
    role: 'personal',
    changeQueue: (currQueue) => set(() => ({ queue: currQueue })),
    delStoreQueue: () => set(() => ({ queue: [] })),
    changeRole: (role) => {
        set(() => ({ role: role }))
        console.log('change role', role)
    },
}))
